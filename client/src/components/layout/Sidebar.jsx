import { useRef, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  ClipboardCheck,
  CreditCard,
  Dumbbell,
  Apple,
  UserPlus,
  UserCog,
  PieChart,
  Smartphone,
  Settings,
  Receipt,
  BadgePercent,
  MessagesSquare,
  CalendarDays,
  Building2,
  Smile,
  Frown,
  MoreHorizontal,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import clsx from 'clsx';

const navItems = [
  { key: 'dashboard', label: 'Dashboard', path: '/', icon: LayoutDashboard },
  { key: 'analytics', label: 'Insights', path: '/analytics', icon: PieChart },
  {
    key: 'members',
    label: 'Members',
    path: '/members',
    icon: Users,
    children: [
      { key: 'all-members', label: 'All Members', path: '/members', icon: Users },
      { key: 'add-member', label: 'Add Member', path: '/members/new', icon: UserPlus },
      { key: 'active-members', label: 'Active Members', path: '/members?status=active', icon: Smile },
      { key: 'inactive-members', label: 'Inactive Members', path: '/members?status=inactive', icon: Frown },
    ],
  },
  { key: 'attendance', label: 'Attendance', path: '/attendance', icon: ClipboardCheck },
  { key: 'memberships', label: 'Memberships', path: '/memberships', icon: BadgePercent },
  { key: 'finance', label: 'Finance', path: '/finance', icon: CreditCard },
  { key: 'workouts', label: 'Workout Plans', path: '/workouts', icon: Dumbbell },
  { key: 'diets', label: 'Diet Plans', path: '/diets', icon: Apple },
  { key: 'leads', label: 'Leads', path: '/leads', icon: UserPlus },
  { key: 'staff', label: 'Staff', path: '/staff', icon: UserCog },
  { key: 'trainers', label: 'Trainers', path: '/trainers', icon: Users },
  { key: 'reports', label: 'Reports', path: '/reports', icon: Receipt },
  { key: 'branches', label: 'Branches', path: '/branches', icon: Building2 },
  { key: 'messaging', label: 'Messaging', path: '/messaging', icon: MessagesSquare },
  { key: 'operations', label: 'Operations', path: '/operations', icon: CalendarDays },
  { key: 'subscription', label: 'Subscription', path: '/subscription', icon: CreditCard },
  { key: 'member-app', label: 'Member App', path: '/member-app', icon: Smartphone },
  { key: 'settings', label: 'Settings', path: '/settings', icon: Settings },
];

function NavItem({ item, showText, isOpen, onToggle, onClose, horizontal = false }) {
  const location = useLocation();
  const itemRef = useRef(null);
  const closeTimerRef = useRef(null);
  const [popupPosition, setPopupPosition] = useState(null);
  const hasChildren = item.children && item.children.length > 0;
  const clearCloseTimer = () => {
    if (closeTimerRef.current) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };
  const scheduleClose = () => {
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setPopupPosition(null);
      onToggle('');
    }, 180);
  };

  const isChildActive = (path) => {
    const [pathname, search] = path.split('?');
    const locSearch = location.search.startsWith('?')
      ? location.search.slice(1)
      : location.search;
    return (
      location.pathname === pathname &&
      (search ? locSearch === search : !locSearch)
    );
  };

  const linkClasses = (isActive) =>
    clsx(
      'flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors',
      showText ? 'justify-start gap-3 px-3' : 'justify-center px-3',
      isActive
        ? 'bg-primary-800 text-white'
        : 'text-white/90 hover:bg-primary-600 hover:text-white'
    );

  if (!hasChildren) {
    return (
      <NavLink
        to={item.path}
        onClick={onClose}
        className={({ isActive }) => linkClasses(isActive)}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span
          className={clsx(
            'whitespace-nowrap',
            !showText && 'hidden md:hidden'
          )}
        >
          {item.label}
        </span>
      </NavLink>
    );
  }

  return (
    <div
      className={horizontal ? 'relative' : 'w-full'}
      ref={itemRef}
      onMouseEnter={() => {
        if (horizontal) {
          clearCloseTimer();
          const rect = itemRef.current?.getBoundingClientRect();
          if (rect) setPopupPosition({ top: rect.bottom + 4, left: rect.left });
          onToggle(item.key);
        }
      }}
      onMouseLeave={() => {
        if (horizontal) {
          scheduleClose();
        }
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(isOpen ? '' : item.key)}
        className={clsx(
          'flex items-center rounded-lg py-2.5 text-sm font-medium transition-colors',
          horizontal ? 'w-auto px-3' : 'w-full',
          showText ? 'justify-start gap-3 px-3' : 'justify-center px-3',
          isOpen
            ? 'bg-primary-800 text-white'
            : 'text-white/90 hover:bg-primary-600 hover:text-white'
        )}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span
          className={clsx(
            'whitespace-nowrap',
            !showText && 'hidden md:hidden'
          )}
        >
          {item.label}
        </span>
      </button>

      {isOpen && (
        <div className={clsx(
          'overflow-hidden rounded-xl border border-primary-600 bg-primary-800 p-2 shadow-inner',
          horizontal ? 'fixed z-[100] mt-1 min-w-56 shadow-xl' : 'mt-1 w-full'
        )}
        style={horizontal && popupPosition ? { top: popupPosition.top, left: popupPosition.left } : undefined}
        onMouseEnter={horizontal ? clearCloseTimer : undefined}
        onMouseLeave={horizontal ? scheduleClose : undefined}>
          {item.children.map((child) => (
            <Link
              key={child.key}
              to={child.path}
              className={clsx(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                isChildActive(child.path)
                  ? 'bg-primary-700 text-white'
                  : 'text-white/90 hover:bg-primary-600 hover:text-white'
              )}
            >
              <child.icon className="h-4 w-4 shrink-0" />
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ mobileOpen, onClose, menuStyle = 'vertical', sideNavOptions }) {
  const [expanded, setExpanded] = useState(false);
  const [openKey, setOpenKey] = useState('');
  const { canAccess } = useAuth();
  const { data, activeBranch, currentBranch } = useData();
  const visibleItems = navItems.filter((item) => canAccess(item.key));
  const horizontal = menuStyle === 'horizontal';
  const showText = horizontal || mobileOpen || expanded || sideNavOptions?.pinned;
  const primaryHorizontalKeys = ['dashboard', 'members', 'attendance', 'memberships', 'finance', 'leads', 'operations', 'reports'];
  const horizontalItems = visibleItems.filter((item) => primaryHorizontalKeys.includes(item.key));
  const secondaryHorizontalItems = visibleItems.filter((item) => !primaryHorizontalKeys.includes(item.key));
  const itemsToRender = horizontal
    ? [
        ...horizontalItems,
        ...(secondaryHorizontalItems.length > 0
          ? [{ key: 'more', label: 'More', icon: MoreHorizontal, path: '#', children: secondaryHorizontalItems }]
          : []),
      ]
    : visibleItems;

  return (
    <>
      {mobileOpen && !horizontal && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/30 md:hidden"
          onClick={onClose}
        />
      )}
      <aside
        onMouseEnter={() => setExpanded(true)}
        onMouseLeave={() => {
          setExpanded(false);
          setOpenKey('');
        }}
        className={clsx(
          horizontal
            ? 'relative z-20 w-full border-b border-primary-800 bg-primary-700 text-white print:hidden'
            : 'fixed left-0 top-0 z-50 h-full transform border-r border-primary-800 bg-primary-700 text-white transition-all duration-200 print:hidden md:translate-x-0 md:w-16 md:hover:w-60',
          !horizontal && (mobileOpen ? 'w-60 translate-x-0' : 'w-60 -translate-x-full'),
          !horizontal && sideNavOptions?.pinned && 'md:w-60 md:hover:w-60',
          horizontal && (mobileOpen ? 'fixed inset-x-0 top-16 z-50 shadow-xl md:relative md:top-0 md:shadow-none' : 'hidden md:block')
        )}
      >
        <div
          className={clsx(
            'flex h-16 items-center gap-2 border-b border-primary-800',
            horizontal && 'hidden',
            showText ? 'px-5' : 'px-3'
          )}
        >
          {data.settings.logo ? (
            <img src={data.settings.logo} alt={`${data.settings.gymName || 'Gym'} logo`} className="h-9 w-9 shrink-0 rounded-lg bg-white object-contain p-1" />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white font-bold text-primary-700">BF</div>
          )}
          <div className={clsx('flex flex-col min-w-0', !showText && 'hidden md:hidden')}>
            <span className="whitespace-nowrap text-lg font-bold text-white leading-tight">
              BilzyFit
            </span>
            <span className="truncate text-[10px] text-primary-200 font-medium max-w-[130px]">
              {activeBranch === 'all' ? 'All Gym Centres' : (currentBranch?.name || activeBranch)}
            </span>
          </div>
        </div>
        <nav className={clsx(
          'gap-1 p-3',
          horizontal
            ? 'flex flex-nowrap items-center justify-start gap-1 overflow-visible p-2'
            : 'flex h-[calc(100%-4rem)] flex-col overflow-y-auto overflow-x-hidden md:overflow-visible md:overflow-x-visible',
          sideNavOptions?.opened === false && !horizontal && 'opacity-95'
        )}>
          {itemsToRender.map((item) => (
            <NavItem
              key={item.key}
              item={item}
              showText={showText}
              isOpen={openKey === item.key}
              onToggle={setOpenKey}
              onClose={onClose}
              horizontal={horizontal}
            />
          ))}
        </nav>
      </aside>
    </>
  );
}
