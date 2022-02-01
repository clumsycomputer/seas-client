import { MoreVert } from '@mui/icons-material'
import { IconButton, IconButtonProps, Menu } from '@mui/material'
import { Fragment, ReactNode, useRef, useState } from 'react'

export interface MenuButtonProps {
  buttonColor: IconButtonProps['color']
  buttonIcon: ReactNode
  menuItems: Array<ReactNode>
}

export function MenuButton(props: MenuButtonProps) {
  const { buttonColor, buttonIcon, menuItems } = props
  const [menuOpen, setMenuOpen] = useState<boolean>(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  return (
    <Fragment>
      <IconButton
        ref={buttonRef}
        color={buttonColor}
        onClick={() => {
          setMenuOpen(true)
        }}
      >
        {buttonIcon}
      </IconButton>
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
        {menuItems}
      </Menu>
    </Fragment>
  )
}
