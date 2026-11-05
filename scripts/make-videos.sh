#!/usr/bin/env bash
# Заглушки видео для прототипа: вертикальные ролики 540×960 из картинок
# (медленный зум + плавная смена кадров). Запуск: bash scripts/make-videos.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/videos
make() { # имя, три картинки (пути от assets/)
  local out=$1; shift
  local args=() i=0
  for p in "$@"; do args+=(-loop 1 -framerate 25 -t 4 -i "assets/$p"); done
  local f=""
  for p in "$@"; do
    f+="[$i:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,zoompan=z='1+0.0012*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=540x960:fps=25,format=yuv420p,setsar=1[v$i];"
    i=$((i+1))
  done
  f+="[v0][v1]xfade=transition=fade:duration=0.6:offset=3.4[a];[a][v2]xfade=transition=fade:duration=0.6:offset=6.8,format=yuv420p[out]"
  ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$f" -map "[out]" -c:v libx264 -preset slow -crf 27 -movflags +faststart -an "assets/videos/$out.mp4"
  ffmpeg -y -loglevel error -i "assets/videos/$out.mp4" -frames:v 1 -q:v 3 "assets/videos/$out.jpg"
}
make office stories/move-office.jpg stories/move-rooms.jpg stories/move-coffee.jpg
make shoot frames/shoot.jpg photos/p05.jpg photos/p11.jpg
make awards frames/awards.jpg stories/awards.jpg stories/top10.jpg
make motion photos/p01.jpg photos/p16.jpg photos/p18.jpg
make welcome news/n3.jpg stories/move-office.jpg stories/top10.jpg
