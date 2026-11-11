// Иконки интерфейса — библиотека Gravity UI (https://gravity-ui.com/ru/icons).
// Экспортируются под прежними именами (LuArrowRight и т.д.), чтобы экраны не пришлось переписывать.
// Размер задаётся классами h-*/w-*, цвет — currentColor.
import React from 'react';
import {
  ArrowRight, Bell, BookOpen, Briefcase, Persons, Gift, Calendar, Check, ChevronDown, ChevronLeft, ChevronRight, Clock,
  Gear, Copy, ArrowDownToLine, Eye, FileText, Filmstrip, Hammer, Headphones, Wrench, House, Picture, CircleInfo, Key,
  Display, Envelope, MapPin, Megaphone, Bars, Comment, Hierarchy, SquareArticle, Box, Palette, Sparkles, Pause, Handset,
  Plane, Play, Plus, ChartColumn, Rocket, ScalesBalanced, Magnifier, PaperPlane, ShieldCheck, ShoppingBag, Flag, Star,
  Sticker, Pill, TrashBin, Cup, Tv, Video, Xmark,
} from '@gravity-ui/icons';

// lucide принимал strokeWidth и size — у Gravity иконки залитые, эти свойства просто отбрасываем
const wrap = (Icon) => {
  const C = React.forwardRef(({ strokeWidth, size, ...rest }, ref) => <Icon ref={ref} aria-hidden="true" {...rest} />);
  C.displayName = Icon.displayName || Icon.name;
  return C;
};

export const LuArrowRight = wrap(ArrowRight);
export const LuBell = wrap(Bell);
export const LuBookOpen = wrap(BookOpen);
export const LuBriefcase = wrap(Briefcase);
export const LuBuilding2 = wrap(Persons);
export const LuCake = wrap(Gift);
export const LuCalendar = wrap(Calendar);
export const LuCheck = wrap(Check);
export const LuChevronDown = wrap(ChevronDown);
export const LuChevronLeft = wrap(ChevronLeft);
export const LuChevronRight = wrap(ChevronRight);
export const LuClock = wrap(Clock);
export const LuCog = wrap(Gear);
export const LuCopy = wrap(Copy);
export const LuDownload = wrap(ArrowDownToLine);
export const LuEye = wrap(Eye);
export const LuFileText = wrap(FileText);
export const LuFilm = wrap(Filmstrip);
export const LuHammer = wrap(Hammer);
export const LuHeadphones = wrap(Headphones);
export const LuHeadset = wrap(Wrench);
export const LuHouse = wrap(House);
export const LuImage = wrap(Picture);
export const LuInfo = wrap(CircleInfo);
export const LuKeyRound = wrap(Key);
export const LuLaptop = wrap(Display);
export const LuMail = wrap(Envelope);
export const LuMapPin = wrap(MapPin);
export const LuMegaphone = wrap(Megaphone);
export const LuMenu = wrap(Bars);
export const LuMessageCircle = wrap(Comment);
export const LuNetwork = wrap(Hierarchy);
export const LuNewspaper = wrap(SquareArticle);
export const LuPackage = wrap(Box);
export const LuPalette = wrap(Palette);
export const LuPartyPopper = wrap(Sparkles);
export const LuPause = wrap(Pause);
export const LuPhone = wrap(Handset);
export const LuPlane = wrap(Plane);
export const LuPlay = wrap(Play);
export const LuPlus = wrap(Plus);
export const LuPresentation = wrap(ChartColumn);
export const LuRocket = wrap(Rocket);
export const LuScale = wrap(ScalesBalanced);
export const LuSearch = wrap(Magnifier);
export const LuSend = wrap(PaperPlane);
export const LuShieldCheck = wrap(ShieldCheck);
export const LuShoppingBag = wrap(ShoppingBag);
export const LuSparkles = wrap(Sparkles);
export const LuSprout = wrap(Flag);
export const LuStar = wrap(Star);
export const LuStickyNote = wrap(Sticker);
export const LuThermometer = wrap(Pill);
export const LuTrash2 = wrap(TrashBin);
export const LuTrophy = wrap(Cup);
export const LuTv = wrap(Tv);
export const LuUsers = wrap(Persons);
export const LuVideo = wrap(Video);
export const LuWrench = wrap(Wrench);
export const LuX = wrap(Xmark);
