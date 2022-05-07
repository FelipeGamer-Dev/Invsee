import { ItemStack } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { FakeContainer } from "../ContainerMenu/containers/FakeContainer";

export function setEnderChest(container: FakeContainer, player: ServerPlayer): void {
  const items: ItemStack[] = player.save().EnderChestInventory.map((tag: Record<string, any>) => ItemStack.fromTag(tag));

  for (let i = 0; i < items.length; i++) {
    if (!items[i]) container.setItem(i, ItemStack.EMPTY_ITEM);
    container.setItem(i, items[i]);
  }
} 
