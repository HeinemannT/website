import React from 'react';
import { 
  Shield, 
  BarChart3, 
  AlertCircle, 
  Folder, 
  Database, 
  User, 
  Award, 
  Box, 
  CheckCircle2, 
  Globe, 
  Mail, 
  Calendar, 
  ToggleLeft, 
  List, 
  FunctionSquare, 
  Lock, 
  Unlock, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  StretchHorizontal, 
  StretchVertical, 
  ArrowUpRight, 
  CornerDownLeft, 
  ArrowDownAZ, 
  LayoutGrid, 
  Filter,
  Type,
  BoxSelect
} from 'lucide-react';

// --- ENTITY ICONS ---

export const ShieldIcon = ({ className }: { className?: string }) => <Shield className={className} />;
export const ChartIcon = ({ className }: { className?: string }) => <BarChart3 className={className} />;
export const AlertIcon = ({ className }: { className?: string }) => <AlertCircle className={className} />;
export const FolderIcon = ({ className }: { className?: string }) => <Folder className={className} />;
export const DatabaseIcon = ({ className }: { className?: string }) => <Database className={className} />;
export const UserIcon = ({ className }: { className?: string }) => <User className={className} />;
export const BadgeIcon = ({ className }: { className?: string }) => <Award className={className} />;
export const CubeIcon = ({ className }: { className?: string }) => <Box className={className} />;
export const CheckIcon = ({ className }: { className?: string }) => <CheckCircle2 className={className} />;
export const GlobeIcon = ({ className }: { className?: string }) => <Globe className={className} />;
export const MailIcon = ({ className }: { className?: string }) => <Mail className={className} />;
export const CalendarIcon = ({ className }: { className?: string }) => <Calendar className={className} />;

// --- PROPERTY ICONS ---

export const ToggleIcon = ({ className }: { className?: string }) => <ToggleLeft className={className} />;
export const ListIcon = ({ className }: { className?: string }) => <List className={className} />;
export const FormulaIcon = ({ className }: { className?: string }) => <FunctionSquare className={className} />;

// --- TOOL ICONS ---

export const LockIcon = ({ className }: { className?: string }) => <Lock className={className} />;
export const UnlockIcon = ({ className }: { className?: string }) => <Unlock className={className} />;

export const AlignLeftIcon = ({ className }: { className?: string }) => <AlignLeft className={className} />;
export const AlignCenterIcon = ({ className }: { className?: string }) => <AlignCenter className={className} />;
export const AlignRightIcon = ({ className }: { className?: string }) => <AlignRight className={className} />;

export const DistributeHorizontalIcon = ({ className }: { className?: string }) => <StretchHorizontal className={className} />;
export const DistributeVerticalIcon = ({ className }: { className?: string }) => <StretchVertical className={className} />;

export const RefIcon = ({ className }: { className?: string }) => <ArrowUpRight className={className} />;
export const RRefIcon = ({ className }: { className?: string }) => <CornerDownLeft className={className} />;

// --- SORT & FILTER ICONS ---

export const SortAlphaIcon = ({ className }: { className?: string }) => <ArrowDownAZ className={className} />;
export const SortTypeIcon = ({ className }: { className?: string }) => <LayoutGrid className={className} />;
export const FilterIcon = ({ className }: { className?: string }) => <Filter className={className} />;

// --- COSMETIC ICONS ---
export const TypeIcon = ({ className }: { className?: string }) => <Type className={className} />;
export const GroupIcon = ({ className }: { className?: string }) => <BoxSelect className={className} />;