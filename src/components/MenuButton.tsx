import { MoreVert } from '@mui/icons-material'
import { IconButton, Menu, MenuItem, MenuItemProps } from '@mui/material'
import React from 'react'
import { ForwardRefExoticComponent, Fragment, useRef, useState } from 'react'

export interface MenuButtonProps {
  ButtonComponent: ForwardRefExoticComponent<
    {
      onClick: () => void
    } & React.RefAttributes<HTMLButtonElement>
  >
  menuItems: Array<MenuItemProps>
}

export function MenuButton(props: MenuButtonProps) {
  const { ButtonComponent, menuItems } = props
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <Fragment>
      <ButtonComponent
        ref={buttonRef}
        onClick={() => {
          setMenuOpen(true)
        }}
      />
      <Menu
        keepMounted={true}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        anchorEl={buttonRef.current}
        open={menuOpen}
        onClose={() => {
          setMenuOpen(false)
        }}
      >
        {menuItems.map((someMenuItem, menuItemIndex) => {
          return (
            <MenuItem
              key={`${menuItemIndex}`}
              {...someMenuItem}
              onClick={(clickEvent) => {
                if (someMenuItem.onClick) {
                  someMenuItem.onClick(clickEvent)
                }
                setMenuOpen(false)
              }}
            />
          )
        })}
      </Menu>
    </Fragment>
  )
}

export interface DenseMenuButtonProps
  extends Pick<MenuButtonProps, 'menuItems'> {}

export function DenseMenuButton(props: DenseMenuButtonProps) {
  const { menuItems } = props
  return (
    <MenuButton
      menuItems={menuItems}
      ButtonComponent={React.forwardRef((props, ref) => {
        return (
          <IconButton ref={ref} {...props}>
            <MoreVert />
          </IconButton>
        )
      })}
    />
  )
}
