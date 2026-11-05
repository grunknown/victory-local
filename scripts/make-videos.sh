#!/usr/bin/env bash
# Заглушки видео для прототипа: вертикальные ролики 540×960 из фото команды
# (медленный зум + плавная смена кадров). Запуск: bash scripts/make-videos.sh
set -euo pipefail
cd "$(dirname "$0")/.."
mkdir -p assets/videos
make() { # имя, три фото
  local out=$1; shift
  local args=() i=0
  for p in "$@"; do args+=(-loop 1 -framerate 25 -t 4 -i "assets/photos/$p.jpg"); done
  local f=""
  for p in "$@"; do
    f+="[$i:v]scale=1080:1080,crop=608:1080,zoompan=z='1+0.0016*on':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=540x960:fps=25,format=yuv420p,setsar=1[v$i];"
    i=$((i+1))
  done
  f+="[v0][v1]xfade=transition=fade:duration=0.6:offset=3.4[a];[a][v2]xfade=transition=fade:duration=0.6:offset=6.8,format=yuv420p[out]"
  ffmpeg -y -loglevel error "${args[@]}" -filter_complex "$f" -map "[out]" -c:v libx264 -preset slow -crf 28 -movflags +faststart -an "assets/videos/$out.mp4"
  ffmpeg -y -loglevel error -i "assets/videos/$out.mp4" -frames:v 1 -q:v 4 "assets/videos/$out.jpg"
}
make office p15 p17 p12
make shoot p05 p11 p07
make motion p01 p16 p18
make awards p03 p08 p13
make welcome p10 p14 p09
