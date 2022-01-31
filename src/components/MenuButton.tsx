import { MoreVert } from '@mui/icons-material'
import { IconButton, IconButtonProps, Menu } from '@mui/material'
import { Fragment, ReactNode, useState } from 'react'

export interface MenuButtonProps {
  buttonColor: IconButtonProps['color']
  buttonIcon: ReactNode
  menuItems: Array<ReactNode>
}

export function MenuButton(props: MenuButtonProps) {
  const { buttonColor, buttonIcon, menuItems } = props
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null)
  return (
    <Fragment>
      <IconButton
        color={buttonColor}
        onClick={(clickEvent) => {
          setMenuAnchor(clickEvent.currentTarget)
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
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null)
        }}
      >
        {menuItems}
      </Menu>
    </Fragment>
  )
}
