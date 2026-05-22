const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  Events
} = require("discord.js");

const config = require("./config.json");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.once(Events.ClientReady, async () => {
  console.log(`✅ Bot online como ${client.user.tag}`);

  const canal = await client.channels.fetch(config.canalRegistroId).catch(() => null);

  if (!canal) {
    return console.log("❌ Canal não encontrado.");
  }

  const embed = new EmbedBuilder()
    .setColor("#7B2CFF")
    .setTitle("⭐ Registro Stars Roleplay")
    .setDescription(
      "Bem-vindo(a) à **Stars Roleplay**!\n\n" +
      "Para liberar todos os canais do servidor, clique no botão abaixo e faça seu registro.\n\n" +
      "**Você vai precisar informar:**\n\n" +
      "```yaml\n" +
      "Nick:\n" +
      "ID:\n" +
      "Serial MTA:\n" +
      "```"
    )
    .setThumbnail(client.user.displayAvatarURL())
    .setImage("https://i.imgur.com/9QZ7Z6Z.png")
    .setFooter({
      text: "Stars Roleplay • Sistema de Registro"
    });

  const row = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("abrir_registro")
      .setLabel("⭐ Registrar-se")
      .setStyle(ButtonStyle.Primary)
  );

  await canal.send({
    embeds: [embed],
    components: [row]
  });

  console.log("✅ Painel enviado.");
});

client.on(Events.InteractionCreate, async (interaction) => {

  if (interaction.isButton()) {

    if (interaction.customId === "abrir_registro") {

      const modal = new ModalBuilder()
        .setCustomId("modal_registro")
        .setTitle("Registro Stars Roleplay");

      const nick = new TextInputBuilder()
        .setCustomId("nick")
        .setLabel("Nick")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Exemplo: Bart")
        .setRequired(true);

      const id = new TextInputBuilder()
        .setCustomId("id")
        .setLabel("ID")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Exemplo: 12")
        .setRequired(true);

      const serial = new TextInputBuilder()
        .setCustomId("serial")
        .setLabel("Serial MTA")
        .setStyle(TextInputStyle.Short)
        .setPlaceholder("Cole seu serial do MTA")
        .setRequired(true);

      const row1 = new ActionRowBuilder().addComponents(nick);
      const row2 = new ActionRowBuilder().addComponents(id);
      const row3 = new ActionRowBuilder().addComponents(serial);

      modal.addComponents(row1, row2, row3);

      await interaction.showModal(modal);
    }
  }

  if (interaction.isModalSubmit()) {

    if (interaction.customId === "modal_registro") {

      const nick = interaction.fields.getTextInputValue("nick");
      const id = interaction.fields.getTextInputValue("id");
      const serial = interaction.fields.getTextInputValue("serial");

      const novoNick = `${nick} [${id}]`;

      try {
        await interaction.member.setNickname(novoNick);
      } catch (err) {
        console.log("Erro ao mudar nick.");
      }

      try {
        await interaction.member.roles.add(config.cargoMembroId);
      } catch (err) {
        console.log("Erro ao adicionar cargo.");
      }

      console.log(`
========================
NOVO REGISTRO
Nick: ${nick}
ID: ${id}
Serial: ${serial}
========================
`);

      const sucesso = new EmbedBuilder()
        .setColor("#00ff88")
        .setTitle("✅ Registro concluído")
        .setDescription(
          `Seu registro foi realizado com sucesso.\n\n` +
          `👤 Nick: **${nick}**\n` +
          `🆔 ID: **${id}**\n\n` +
          `Bem-vindo(a) à **Stars Roleplay**!`
        );

      await interaction.reply({
        embeds: [sucesso],
        ephemeral: true
      });
    }
  }
});

client.login(process.env.TOKEN);
