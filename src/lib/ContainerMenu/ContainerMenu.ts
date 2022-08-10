/*
          _____                    _
  ___  __|___  |__ _ __         __| | _____   __
 / __|/ _ \ / / _ \ '_ \ _____ / _` |/ _ \ \ / /
 \__ \  __// /  __/ | | |_____| (_| |  __/\ V /
 |___/\___/_/ \___|_| |_|      \__,_|\___| \_/

  ContainerMenu - An API for BDSX that allows you to create fake interactive container menus !

 */

import { FakeContainer } from "./containers/FakeContainer";
import { ChestContainer } from "./containers/ChestContainer";
import { ServerPlayer } from "bdsx/bds/player";
import { PlayerManager } from "./PlayerManager";
import { PacketListener } from "./listener/PacketListener";
import { ItemStack } from "bdsx/bds/inventory";
import { DoubleChestContainer } from "./containers/DoubleChestContainer";
import { FakeDoubleContainer } from "./containers/FakeDoubleContainer";

PacketListener.loadListeners();

/**
 * All the fake containers types.
 */
export enum FakeContainerType {
    Chest,
    TrappedChest,
    DoubleChest
}

/**
 * All the containers sizes.
 */
export enum ContainerSize {
    Chest = 27,
    DoubleChest = 54
}

export type ContainerInventory = Record<number, ItemStack>;;

export namespace ContainerMenu {
    /**
     * Creates a fake container for a specific player.
     *
     * @param player - The player to create the container for.
     * @param container - The container type to create.
     */
    export function create(player: ServerPlayer, container: FakeContainerType, inventory?: ContainerInventory): FakeContainer | FakeDoubleContainer {
        if(!PlayerManager.hasContainer(player.getNetworkIdentifier())) {
            switch(container) {
                case FakeContainerType.Chest:
                    return new ChestContainer(player, inventory);
                case FakeContainerType.DoubleChest:
                    return new DoubleChestContainer(player, inventory);
            }
        } else throw new Error("Player already has a fake container assigned. Close it before creating a new one.");
    }
}
