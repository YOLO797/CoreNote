import type { FC } from 'react';
import React, { useContext, useState, useEffect } from 'react';
import { context, Link, NavLink } from 'dumi/theme';
import LocaleSelect from './LocaleSelect';
import SlugList from './SlugList';
import './SideMenu.less';
import classNames from 'classnames';

interface INavbarProps {
  mobileMenuCollapsed: boolean;
  location: any;
  darkPrefix?: React.ReactNode;
}

const SideMenu: FC<INavbarProps> = ({
  mobileMenuCollapsed,
  location,
  darkPrefix,
}) => {
  const {
    config: {
      logo,
      title,
      description,
      mode,
      repository: { url: repoUrl },
    },
    menu,
    nav: navItems,
    base,
    meta,
  } = useContext(context);
  const isHiddenMenus =
    Boolean((meta.hero || meta.features || meta.gapless) && mode === 'site') ||
    meta.sidemenu === false ||
    undefined;

  const [currentPath, setCurrentPath] = useState<string>('');
  const [openPaths, setOpenPaths] = useState<string[]>([]);
  useEffect(() => {
    const [_, __, ...params] = decodeURIComponent(
      window.location.pathname,
    ).split('/');
    let path = '';
    if (params.length === 1) path = `/${params[0]}`;
    else if (params.length === 2) path = `/${params[0]}/${params[1]}`;
    else {
      params.forEach((item, index) => {
        if (index < params.length - 1) path += `/${item}`;
      });
    }
    setOpenPaths([path]);
    setCurrentPath(path);
  }, [window.location.pathname]);

  // const open = (path) => {
  //   const arr = [...openPaths];
  //   const i = arr.indexOf(path)
  //   if (i > -1) arr.splice(i, 1);
  //   else arr.push(path);
  //   setOpenPaths(arr);
  // }

  return (
    <div
      className="__dumi-default-menu"
      data-mode={mode}
      data-hidden={isHiddenMenus}
      data-mobile-show={!mobileMenuCollapsed || undefined}
    >
      <div className="__dumi-default-menu-inner">
        <div className="__dumi-default-menu-header">
          <Link
            to={base}
            className="__dumi-default-menu-logo"
            style={{
              backgroundImage: logo && `url('${logo}')`,
            }}
          />
          <h1 className="__dumi-default-layout-hero">{title}</h1>
          <p>{description}</p>
          {/* github star badge */}
          {/github\.com/.test(repoUrl) && mode === 'doc' && (
            <p>
              <object
                type="image/svg+xml"
                data={`https://img.shields.io/github/stars${
                  repoUrl.match(/((\/[^\/]+){2})$/)[1]
                }?style=social`}
              />
            </p>
          )}
        </div>
        {/* mobile nav list */}

        <div
          className="__dumi-default-menu-mobile-area"
          style={
            {
              //暂时不显示配色切换工具
              // display: "none"
            }
          }
        >
          {!!navItems.length && (
            <ul className="__dumi-default-menu-nav-list">
              {navItems.map((nav) => {
                const child = Boolean(nav.children?.length) && (
                  <ul>
                    {nav.children.map((item) => (
                      <li key={item.path || item.title}>
                        <NavLink to={item.path}>{item.title}</NavLink>
                      </li>
                    ))}
                  </ul>
                );

                return (
                  <li key={nav.path || nav.title}>
                    {nav.path ? (
                      <NavLink to={nav.path}>{nav.title}</NavLink>
                    ) : (
                      nav.title
                    )}
                    {child}
                  </li>
                );
              })}
            </ul>
          )}
          {/* site mode locale select */}
          <LocaleSelect location={location} />
          {darkPrefix}
        </div>
        {/* menu list */}
        <ul className="__dumi-default-menu-list">
          {!isHiddenMenus &&
            menu.map((item) => {
              // always use meta from routes to reduce menu data size
              const hasSlugs = Boolean(meta.slugs?.length);
              const hasChildren =
                item.children && Boolean(item.children.length);
              const show1LevelSlugs =
                meta.toc === 'menu' &&
                !hasChildren &&
                hasSlugs &&
                item.path === location.pathname.replace(/([^^])\/$/, '$1');
              const isCurNav = currentPath === item.path;
              const isOpenPath = openPaths.indexOf(item.path) > -1;
              const parent_path = item.path.split('/').slice(0, -1).join('/');
              const sameParentDisplay = decodeURIComponent(
                window.location.pathname,
              ).includes(parent_path);
              if (!sameParentDisplay) return;
              return (
                <li
                  key={item.path || item.title}
                  className="__dumi-default-menu-list-item"
                >
                  <NavLink
                    to={item.path}
                    exact
                    className={classNames(
                      '__dumi-default-menu-list-item-nav-title',
                      {
                        '__dumi-default-menu-list-item-nav-titleActive':
                          isCurNav,
                      },
                    )}
                  >
                    <div
                      className={classNames(
                        '__dumi-default-menu-list-item-nav',
                        {
                          '__dumi-default-menu-list-item-navActive': isCurNav,
                        },
                      )}
                    >
                      <span>{item.title}</span>
                      <p
                        className={classNames(
                          '__dumi-default-menu-list-item-nav-sign',
                          {
                            '__dumi-default-menu-list-item-nav-signActive':
                              isOpenPath,
                            '__dumi-default-menu-list-item-nav-signHighlight':
                              isCurNav,
                            '__dumi-default-menu-list-item-nav-signNone':
                              !hasChildren,
                          },
                        )}
                      >
                        <svg
                          aria-hidden="true"
                          role="presentation"
                          viewBox="0 0 24 24"
                        >
                          <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z"></path>
                        </svg>
                      </p>
                    </div>
                  </NavLink>

                  {/* group children */}
                  {Boolean(
                    item.children && item.children.length && isOpenPath,
                  ) && (
                    <ul className="__dumi-default-menu-list-item-list">
                      {item.children.map((child) => (
                        // style={{ display: item.hide }}
                        <li key={child.path}>
                          <NavLink to={child.path} exact>
                            <span>{child.title}</span>
                          </NavLink>
                          {/* group children slugs */}
                          {Boolean(
                            meta.toc === 'menu' &&
                              typeof window !== 'undefined' &&
                              child.path === location.pathname &&
                              hasSlugs,
                          ) && <SlugList slugs={meta.slugs} />}
                        </li>
                      ))}
                    </ul>
                  )}
                  {/* group slugs */}
                  {show1LevelSlugs && <SlugList slugs={meta.slugs} />}
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default SideMenu;
