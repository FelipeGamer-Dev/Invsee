import { ArmorSlot, ItemStack } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { FakeDoubleContainer } from "../ContainerMenu/containers/FakeDoubleContainer"

export function setInventory(container: FakeDoubleContainer, player: ServerPlayer): void {
  const armor: ItemStack[] = getFullArmor(player);
  const inventory: ItemStack[] = player.getInventory().getSlots().toArray().reverse();
  const inventorySlots: number[] = getInventorySlots();
  const hotbar: ItemStack[] = inventory.slice(27, 36).reverse();

  for (let i = 0; i < armor.length; i++) {
    if (!armor[i]) continue;
    container.setItem(i * 9, armor[i].clone());
  }

  for (let i = 0; i < inventorySlots.length; i++) {
    if (i < 27 && !inventory[i]) continue;
    else if (i >= 27) {
      if (hotbar[i - 27].amount == 0) {
        container.setItem(inventorySlots[i], ItemStack.EMPTY_ITEM);
      }
      container.setItem(inventorySlots[i], hotbar[i - 27]);
      continue;
    }
    container.setItem(inventorySlots[i], inventory[i]);
  }
  if (player.getOffhandSlot()) container.setItem(28, player.getOffhandSlot().clone());
  addBarriers(container);
}

// Utilities.

function getFullArmor(player: ServerPlayer): ItemStack[] {
  return [
    player.getArmor(ArmorSlot.Head), player.getArmor(ArmorSlot.Chest), player.getArmor(ArmorSlot.Legs),
    player.getArmor(ArmorSlot.Feet)
  ]
}

function getInventorySlots(): number[] {
  let slots: number[] = [];

  for (let i = 2; i <= 54; i += containerConditional(i)) {
    slots.push(i);
  }
  return slots;
}

function addBarriers(container: FakeDoubleContainer): void {
  for (let i = 0; i < 54; i++) {
    const barrier: ItemStack = ItemStack.constructWith("minecraft:barrier");

    if (i == 28 || (i < 34 && ((i % 9) == 0)) || getInventorySlots().includes(i)) continue;
    container.setItem(i, barrier);
  }
}

function containerConditional(i: number): number {
  return (i >= 34 && i < 45) ? 11 : (((i + 1) % 9) !== 0) ? 1 : 3;
}

