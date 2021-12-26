import type { FC, MouseEvent } from 'react';
import React, { useContext } from 'react';
import { context, Link, NavLink } from 'dumi/theme';
import LocaleSelect from './LocaleSelect';
import './Navbar.less';

interface INavbarProps {
  location: any;
  navPrefix?: React.ReactNode;
  darkPrefix?: React.ReactNode;
  onMobileMenuClick: (ev: MouseEvent<HTMLButtonElement>) => void;
}

const Navbar: FC<INavbarProps> = ({
  onMobileMenuClick,
  navPrefix,
  location,
  darkPrefix,
}) => {
  const {
    base,
    config: { mode, title, logo },
    nav: navItems,
  } = useContext(context);

  // if (location.pathname === "/") {
  //   darkPrefix= null;
  // }

  return (
    <div className="__dumi-default-navbar" data-mode={mode}>
      {/* menu toogle button (only for mobile) */}
      <button
        className="__dumi-default-navbar-toggle"
        onClick={onMobileMenuClick}
      />
      {/* logo & title */}
      <Link
        className="__dumi-default-navbar-logo"
        style={{
          backgroundImage: logo && `url('${logo}')`,
        }}
        to={base}
        data-plaintext={logo === false || undefined}
      >
        {title}
        {/* {logo ? "" : title} */}
      </Link>
      <nav>
        {navPrefix}
        {/* nav */}
        {navItems.map((nav) => {
          const child = Boolean(nav.children?.length) && (
            <ul className="nav-children">
              <p className="nav-children-title">请选择二级目录</p>
              {nav.children.map((item) => (
                <li key={item.path} className="nav-child">
                  <NavLink to={item.path}>{item.title}</NavLink>
                </li>
              ))}
            </ul>
          );

          return (
            <span key={nav.title || nav.path}>
              {nav.path ? (
                <NavLink to={nav.path} key={nav.path}>
                  {nav?.children ? (
                    <div>
                      <span>{nav.title}</span>
                      <span className="arrow down"></span>
                    </div>
                  ) : (
                    nav.title
                  )}
                </NavLink>
              ) : (
                nav.title
              )}
              {child}
            </span>
          );
        })}
        <LocaleSelect location={location} />
        {darkPrefix}
      </nav>
    </div>
  );
};

export default Navbar;
