import React from "react";
import { Pressable, Text, View } from "react-native";
import { createMenu } from "@gluestack-ui/core/menu/creator";
import { cssInterop } from "nativewind";

cssInterop(Pressable, { className: "style" });
cssInterop(Text, { className: "style" });
cssInterop(View, { className: "style" });

const UIMenu = createMenu({
  Root: View,
  Item: Pressable,
  Label: Text,
  Backdrop: Pressable,
  Separator: View,
});

type MenuProps = React.ComponentProps<typeof UIMenu> & {
  className?: string;
  onAction?: (key: React.Key) => void;
};

const Menu = React.forwardRef<React.ComponentRef<typeof UIMenu>, MenuProps>(
  ({ className, ...props }, ref) => (
    <UIMenu
      ref={ref}
      closeOnSelect={true}
      offset={8}
      placement="bottom right"
      {...props}
      className={`min-w-44 rounded-2xl bg-white p-2 border border-gray-100 shadow-2xl ${className ?? ""}`}
    />
  )
);

const MenuItem = UIMenu.Item;

type MenuItemLabelProps = React.ComponentProps<typeof UIMenu.ItemLabel> & {
  className?: string;
};

const MenuItemLabel = React.forwardRef<
  React.ComponentRef<typeof UIMenu.ItemLabel>,
  MenuItemLabelProps
>(({ className, ...props }, ref) => (
  <UIMenu.ItemLabel
    ref={ref}
    {...props}
    className={`text-base font-semibold text-gray-800 ${className ?? ""}`}
  />
));

const MenuSeparator = UIMenu.Separator;

Menu.displayName = "Menu";
MenuItemLabel.displayName = "MenuItemLabel";

export { Menu, MenuItem, MenuItemLabel, MenuSeparator };
