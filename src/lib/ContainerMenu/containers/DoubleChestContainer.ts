import { Block } from "bdsx/bds/block";
import { ContainerType } from "bdsx/bds/inventory";
import { ServerPlayer } from "bdsx/bds/player";
import { ContainerInventory, ContainerSize } from "../ContainerMenu";
import { FakeDoubleContainer } from "./FakeDoubleContainer";

export class DoubleChestContainer extends FakeDoubleContainer {
    public constructor(player: ServerPlayer, destructItems?: boolean, inventory?: ContainerInventory) {
        super(
            Block.create("minecraft:chest")!,
            ContainerType.Container,
            ContainerSize.DoubleChest,
            player,
            destructItems,
            inventory
        );
    }
}