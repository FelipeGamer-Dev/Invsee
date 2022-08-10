import { command } from "bdsx/command";
import { events } from "bdsx/event";
import { Language } from "./lib/util/lang";
import { CommandPermissionLevel, PlayerCommandSelector } from "bdsx/bds/command";
import { join } from "path";
import { Configuration } from "./lib/util/configuration";
import { ServerPlayer } from "bdsx/bds/player";
import { ContainerMenu, FakeContainerType } from "./lib/ContainerMenu/ContainerMenu";
import { PlayerManager } from "./lib/ContainerMenu/PlayerManager";
import { FakeDoubleContainer } from "./lib/ContainerMenu/containers/FakeDoubleContainer";
import { setInventory } from "./lib/util/inventory";
import { LevelTickEvent } from "bdsx/event_impl/levelevent";
import { Level } from "bdsx/bds/level";
import { NetworkIdentifier } from "bdsx/bds/networkidentifier";
import { FakeContainer } from "./lib/ContainerMenu/containers/FakeContainer";
import { setEnderChest } from "./lib/util/ender_chest";

const inventories: Map<NetworkIdentifier, invsee> = new Map<NetworkIdentifier, invsee>();

events.serverOpen.on(() => {
  const configuration: Configuration = new Configuration(join(__dirname, "..", "configuration.json"));
  console.log(`InvSee v2\nBy: FelipeGamerDev\n\nLanguage: ${configuration.language}`);
  const language: Language = new Language(configuration.language);

  command.register("invsee", language.translate("commands.invsee")!, CommandPermissionLevel.Operator).overload((param, origin) => {
    if (origin.isServerCommandOrigin()) return;
    const player: ServerPlayer = <ServerPlayer>origin.getEntity();
    const targets: ServerPlayer[] = param.player.newResults(origin, ServerPlayer);
    
    if (targets.length > 1) {
      player.sendTranslatedMessage("commands.generic.tooManyTargets");
    } else if (targets.length == 0) {
      player.sendTranslatedMessage("commands.generic.noTargetMatch");
    } else {
      const target: ServerPlayer = targets[0];

      if (target.getXuid() === player.getXuid()) {
        return player.sendMessage(language.translate("command.error.selfTarget")!);
      }

      const menu: FakeDoubleContainer = <FakeDoubleContainer>ContainerMenu.create(player, FakeContainerType.DoubleChest);
      menu.setCustomName(`${language.translate("inventory.name")!} ${target.getName()}`);
      setInventory(menu, target);
      menu.sendToPlayer();
      inventories.set(player.getNetworkIdentifier(), {
        networkdId: target.getNetworkIdentifier(),
        type: "inventory"
      });
    }
  }, {
    player: PlayerCommandSelector
  });

  command.register("enderinvsee", language.translate("commands.enderinvsee")!, CommandPermissionLevel.Operator).overload((param, origin) => {
    if (origin.isServerCommandOrigin()) return;
    const player: ServerPlayer = <ServerPlayer>origin.getEntity();
    const targets: ServerPlayer[] = param.player.newResults(origin, ServerPlayer);
    
    if (targets.length > 1) {
      player.sendTranslatedMessage("commands.generic.tooManyTargets");
    } else if (targets.length == 0) {
      player.sendTranslatedMessage("commands.generic.noTargetMatch");
    } else {
      const target: ServerPlayer = targets[0];

      if (target.getXuid() === player.getXuid()) {
        return player.sendMessage(language.translate("command.error.selfTarget")!);
      }

      const menu: FakeContainer = <FakeContainer>ContainerMenu.create(player, FakeContainerType.Chest);
      menu.setCustomName(`${language.translate("inventory.ender")!} ${target.getName()}`);
      setEnderChest(menu, target);
      menu.sendToPlayer();
      inventories.set(player.getNetworkIdentifier(), {
        type: "enderchest",
        networkdId: target.getNetworkIdentifier()
      });
    }
  }, {
    player: PlayerCommandSelector
  });
});

events.levelTick.on((event: LevelTickEvent) => {
  const level: Level = event.level;

  for (const player of level.getPlayers()) {
    const networkdId: NetworkIdentifier = player.getNetworkIdentifier();

    if (PlayerManager.hasContainer(networkdId) && inventories.has(networkdId)) {
      const container: FakeDoubleContainer | FakeContainer = PlayerManager.getContainer(networkdId)!;
      const inventory: invsee = inventories.get(networkdId)!;
      
      if (!inventory.networkdId.getActor()) {
        container.destruct();
        continue;
      }

      if (inventory.type == "enderchest") setEnderChest(container as FakeContainer, inventory.networkdId.getActor()!);
      else setInventory(container as FakeDoubleContainer, inventory.networkdId.getActor()!);
    } else if (!PlayerManager.hasContainer(networkdId) && inventories.has(networkdId)) {
      inventories.delete(networkdId);
    }
  } 
});

interface invsee {
  type: "enderchest" | "inventory",
  networkdId: NetworkIdentifier
}
