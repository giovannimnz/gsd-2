# Changelog

All notable changes to GSD are documented in this file.

Format based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## 1.0.0 (2026-04-22)


### Features

* add --commit and --auto-push flags to fork sync script ([b439773](https://github.com/giovannimnz/gsd-2/commit/b439773872b94fefb2147e1dd9768a0d500ee87f))
* add /gsd from-gsd2 reverse migration (.gsd/ → .planning/) ([15cc2d1](https://github.com/giovannimnz/gsd-2/commit/15cc2d177fa3cc512bdde27090a7b4cdfd7dcf1c))
* add /gsd storage command with migration and health subcommands ([1c7edb8](https://github.com/giovannimnz/gsd-2/commit/1c7edb81cbc414d1a92b79dbc4d611a76e602a20))
* add fork automation scripts and release workflow ([298174b](https://github.com/giovannimnz/gsd-2/commit/298174b9ea065dd6c15931fe39ce2ea0edb2012b))
* add interactive install/update scripts and storage backend improvements ([d30391e](https://github.com/giovannimnz/gsd-2/commit/d30391eb4bfe43c3a9070124dc4493fe8b688841))
* add PM2 auto-restart integration to fork sync script ([87fa3af](https://github.com/giovannimnz/gsd-2/commit/87fa3afa3b0964193d227e531209f05d385c61bf))
* add storage_backend field to PREFERENCES.md template ([37ef16c](https://github.com/giovannimnz/gsd-2/commit/37ef16c367e770c8a1be2a206b23b5bbc67d8861))
* add VPN access support for GSD web interface (gsd.atius-srv-1) ([f8e6809](https://github.com/giovannimnz/gsd-2/commit/f8e6809127f076909c67f17ed250588b9f0a9bc0))
* add Windows VPN diagnostic script and firewall rules ([b01274f](https://github.com/giovannimnz/gsd-2/commit/b01274f5ade44ef443b2e3ec0e905ceeaa56db9d))
* **agents:** add 8 specialist subagents and slim pro agents ([8ae59ba](https://github.com/giovannimnz/gsd-2/commit/8ae59babda4d35df99dd3163cb4275d5cf1ed11d))
* **agents:** add 8 specialist subagents, slim pro agents, add GSD phase guard ([4c35d99](https://github.com/giovannimnz/gsd-2/commit/4c35d99a985747ad56a17306a5b309436e67d0cb))
* **agents:** add GSD phase guard to prevent subagent/phase conflicts ([79e118f](https://github.com/giovannimnz/gsd-2/commit/79e118f7cea3be0ef3d8a62a6e13d63d21c022b0))
* **claude-code:** pass thinking level as effort ([6ffb031](https://github.com/giovannimnz/gsd-2/commit/6ffb0313b09cef36a5969f1200669ea63c96215d))
* **claude-code:** pass thinking level as effort ([e59552c](https://github.com/giovannimnz/gsd-2/commit/e59552c98e6029adcbc5133d41e906c31d2a2ede))
* contextual tips ([6fc2289](https://github.com/giovannimnz/gsd-2/commit/6fc228929e922a66a293db29b7ba8ac46eadb058))
* create M002 milestone — Markdown Storage Backend ([72a773a](https://github.com/giovannimnz/gsd-2/commit/72a773affadd6083d71e520243f4ef2e7fd4940b))
* expose core GSD workflow tools over MCP ([96cd24d](https://github.com/giovannimnz/gsd-2/commit/96cd24db6e9054a507e4b5fe18ea872af1093022))
* expose GSD planning tools over MCP ([f651bc0](https://github.com/giovannimnz/gsd-2/commit/f651bc0e3ec46ccc989793843d16e62746b754c9))
* expose GSD workflow tools over MCP for provider parity ([4fb8afe](https://github.com/giovannimnz/gsd-2/commit/4fb8afe96aabf7f863855da5dccdcbe4f2032020))
* expose milestone workflow tools over MCP ([195472b](https://github.com/giovannimnz/gsd-2/commit/195472bb955feaefbd221bdc8cb465f2a2cf5db6))
* expose slice completion over workflow MCP ([2756a9a](https://github.com/giovannimnz/gsd-2/commit/2756a9a0f15077cfc91ad5397206a7c400b1ee9b))
* expose slice replanning over workflow MCP ([9190e7d](https://github.com/giovannimnz/gsd-2/commit/9190e7d3f63f924aad74dbc9a72436fea7bf4b7c))
* expose task completion alias over workflow MCP ([ba931cb](https://github.com/giovannimnz/gsd-2/commit/ba931cb31d4962a57e8008b45fd32614315cc5e6))
* gate workflow MCP units by provider transport capabilities ([1257c03](https://github.com/giovannimnz/gsd-2/commit/1257c03c1603f6e191a22db5b02cd676dc24fdd3))
* **gsd:** add layered depth enforcement to discuss.md ([#4079](https://github.com/giovannimnz/gsd-2/issues/4079)) ([e2fdcd5](https://github.com/giovannimnz/gsd-2/commit/e2fdcd5a08db4b76cccdd3d52207d93f25743950))
* **gsd:** complete ADR-004 capability-aware model routing ([c1497ab](https://github.com/giovannimnz/gsd-2/commit/c1497abff6ea81a49e770376e9ce30bcc48fe6d4))
* **gsd:** complete ADR-004 capability-aware model routing implementation ([d65ff64](https://github.com/giovannimnz/gsd-2/commit/d65ff648c51e11b18c4dc826efb8f7f5952642da)), closes [#2659](https://github.com/giovannimnz/gsd-2/issues/2659)
* **gsd:** extend flat-rate provider detection to custom/externalCli providers ([d19ccff](https://github.com/giovannimnz/gsd-2/commit/d19ccff7f851ba9eea48f65a6de943a1ffded9da))
* **gsd:** extend flat-rate provider detection to custom/externalCli providers ([d4068f4](https://github.com/giovannimnz/gsd-2/commit/d4068f4a00afb3cb557f5767d4d2e4662c0946ff))
* **gsd:** implement ADR-005 multi-model provider and tool strategy ([abc8f2b](https://github.com/giovannimnz/gsd-2/commit/abc8f2ba1ef13c74fdfcac1241a93ffa66334fab))
* **gsd:** implement ADR-005 multi-model provider and tool strategy ([572b64b](https://github.com/giovannimnz/gsd-2/commit/572b64b33cbf5fddf3c15fdb0c8688066cafdc38)), closes [#2790](https://github.com/giovannimnz/gsd-2/issues/2790)
* **gsd:** tiered context injection with scoped decisions, knowledge, and roadmap excerpts ([9a14d3d](https://github.com/giovannimnz/gsd-2/commit/9a14d3dfda3cc3a917c53fa91b152b14e9b403d4))
* implementa update automático robusto com stash e merge automático ([151bdc4](https://github.com/giovannimnz/gsd-2/commit/151bdc490afd4f264b42d0ffdd619155d01ba047))
* **mcp-server:** add secure_env_collect tool via MCP elicitation ([3e19108](https://github.com/giovannimnz/gsd-2/commit/3e191082abe4dd3014d71e7a0a3606d8518b5e47))
* **mcp-server:** add secure_env_collect tool via MCP form elicitation ([c7f1608](https://github.com/giovannimnz/gsd-2/commit/c7f160846a2ec5926db0538e7a923fc2fd2bb8dd)), closes [#3975](https://github.com/giovannimnz/gsd-2/issues/3975)
* **mcp-server:** expose ask_user_questions via elicitation ([f701b7c](https://github.com/giovannimnz/gsd-2/commit/f701b7c1b83d661e53b0e52a789b5f343fa24baa))
* **mcp-server:** expose ask_user_questions via elicitation ([4d17a8f](https://github.com/giovannimnz/gsd-2/commit/4d17a8f2c04bf7c0668b76f6bd48b0b733fb4155))
* OpenAI adapter enriched metadata + atius-router auto-discovery ([e3409bb](https://github.com/giovannimnz/gsd-2/commit/e3409bbfe2efd431d298c5a0612ed6c5095dce99))
* **phase-1:** StorageBackend abstraction layer with SQLite + Markdown backends ([aae22f4](https://github.com/giovannimnz/gsd-2/commit/aae22f42761a4c9f152aecef538add6c1a7584bf))
* **phase-2:** MarkdownStorage implementation + migration tool + gsd-db delegation ([8c69579](https://github.com/giovannimnz/gsd-2/commit/8c6957974aa6d239568b150e540c121b011b4283))
* **phase-3:** Replace SQLite with file-based unit ownership ([6158163](https://github.com/giovannimnz/gsd-2/commit/615816304e6e80adab74840764f625ce15522a24))
* **pi-ai:** add Alibaba DashScope as standalone provider ([#3891](https://github.com/giovannimnz/gsd-2/issues/3891)) ([c14e047](https://github.com/giovannimnz/gsd-2/commit/c14e0470ab1bf07a072648cfb957d5c6c0d3a20b))
* **tui:** improve gsd overlays, shortcuts, and notification flows ([30fb380](https://github.com/giovannimnz/gsd-2/commit/30fb380e9df204d64a185a8b55bb179d0ce21ec1))
* **tui:** improve gsd overlays, shortcuts, and notification flows ([1d356dd](https://github.com/giovannimnz/gsd-2/commit/1d356ddf206a3ec1c80f7a6e1acebb10436960f4))


### Bug Fixes

* **01-build-fixes:** add explicit type annotations to fix implicit any errors ([bdcba19](https://github.com/giovannimnz/gsd-2/commit/bdcba1911a6915083e2267071ca087604d190b10))
* **01-build-fixes:** fix module import resolution for webPreferencesPath ([c446733](https://github.com/giovannimnz/gsd-2/commit/c446733542f9be648e2c9d0dedccf0d493a64115))
* add .env.local to .gitignore to prevent credential commits ([1f69d28](https://github.com/giovannimnz/gsd-2/commit/1f69d283dace1070bb6741015242b37a9bb69b76))
* adiciona timeout de 10s no visualizer subprocess ([032f937](https://github.com/giovannimnz/gsd-2/commit/032f937fd7727eff0b90b900cbacbbd9e71733e7))
* align prompt contracts and validation flow ([0991544](https://github.com/giovannimnz/gsd-2/commit/099154442aaf65a9dc8d1cfba35139d56cd38f30))
* allow Node.js &gt;=20.0.0 for compatibility with v22.9.0 ([39cc1a9](https://github.com/giovannimnz/gsd-2/commit/39cc1a95746ff23614acc431dd6aeaa88ae14717))
* API key auth flow for apiKey-auth providers (not OAuth) ([3fbe80d](https://github.com/giovannimnz/gsd-2/commit/3fbe80d712bf532acdbadba8683b2bcecb78d456))
* **async-jobs:** suppress stale follow-up for jobs consumed by await_job ([#3787](https://github.com/giovannimnz/gsd-2/issues/3787)) ([#3788](https://github.com/giovannimnz/gsd-2/issues/3788)) ([2a2b1d7](https://github.com/giovannimnz/gsd-2/commit/2a2b1d72203491c2a9abdabc462d5d509aede824))
* **auto:** add structured cooldown error and bounded retry budget ([ba760b0](https://github.com/giovannimnz/gsd-2/commit/ba760b06912b040cfad49413908f2657108f3e7a)), closes [#4052](https://github.com/giovannimnz/gsd-2/issues/4052)
* **auto:** increase session timeout to 120s and treat timeout as recoverable pause ([8b74fd3](https://github.com/giovannimnz/gsd-2/commit/8b74fd3f807956d0d5a0bffce5f834173c560eb2))
* **auto:** increase session timeout to 120s and treat timeout as recoverable pause ([#3767](https://github.com/giovannimnz/gsd-2/issues/3767)) ([d5efa6a](https://github.com/giovannimnz/gsd-2/commit/d5efa6a7614c6044f696c13ddb757954da8e088d))
* **auto:** recover from OpenRouter affordability 402 errors ([fe1ada7](https://github.com/giovannimnz/gsd-2/commit/fe1ada77efffdf671754bed3934e97d29d1f44c1))
* **auto:** recover from OpenRouter credit affordability errors ([73e56ef](https://github.com/giovannimnz/gsd-2/commit/73e56ef407c19d0df2ac40108b5453d52511cbcb))
* **auto:** resilient transient error recovery — defer to Core RetryHandler and fix cmdCtx race ([fba4cdd](https://github.com/giovannimnz/gsd-2/commit/fba4cddebccc84195a1ea82883e2060666ceba24))
* **auto:** resolve resource-loader.js from GSD_PKG_ROOT on resume ([96ecdad](https://github.com/giovannimnz/gsd-2/commit/96ecdad05d5b63116694439674124815816ee66e))
* **auto:** resolve resource-loader.js from GSD_PKG_ROOT on resume ([#3949](https://github.com/giovannimnz/gsd-2/issues/3949)) ([34d60ec](https://github.com/giovannimnz/gsd-2/commit/34d60ec2c46d5ce7faf5a7503e210216970eeb9a))
* **auto:** survive transient 429 credential cooldown ([640dad5](https://github.com/giovannimnz/gsd-2/commit/640dad529d696fc7654274259a6637b470eb7506))
* **auto:** survive transient 429 credential cooldown in auto sessions ([60cdc53](https://github.com/giovannimnz/gsd-2/commit/60cdc536f0c967e0995fa4af81fb4ebb471e035b)), closes [#4052](https://github.com/giovannimnz/gsd-2/issues/4052)
* **auto:** use pathToFileURL for cross-platform import and reconcile regression test ([0cf290d](https://github.com/giovannimnz/gsd-2/commit/0cf290d46a0b17be7ba8b0c520c2469068c9fb86))
* avoid double /v1 prefix in API key validation and model discovery ([953bdc8](https://github.com/giovannimnz/gsd-2/commit/953bdc81777571ee03bf61f4303b939a9b2718ad))
* **ci:** address 5 pipeline integrity issues from release audit ([#4119](https://github.com/giovannimnz/gsd-2/issues/4119)) ([3159350](https://github.com/giovannimnz/gsd-2/commit/3159350feec0c26b660b107cda81cfed8de6fee9)), closes [#4118](https://github.com/giovannimnz/gsd-2/issues/4118)
* **ci:** build artifacts in integration-tests job ([246c32d](https://github.com/giovannimnz/gsd-2/commit/246c32dd3baf032343bb42a842caa3af1f72b012))
* **ci:** build artifacts in integration-tests job ([bf9e79b](https://github.com/giovannimnz/gsd-2/commit/bf9e79bacf1660eec1a3bf50ad23617e4a84babf))
* **ci:** narrow windows portability coverage ([f7efa35](https://github.com/giovannimnz/gsd-2/commit/f7efa35ea66b15db73d9b44cbf5eabbb3735d630))
* **ci:** regenerate package-lock.json during version bump ([#4116](https://github.com/giovannimnz/gsd-2/issues/4116)) ([59b7ab3](https://github.com/giovannimnz/gsd-2/commit/59b7ab37f4e76208349d6744fd66dc3496b3b484)), closes [#4115](https://github.com/giovannimnz/gsd-2/issues/4115)
* **ci:** skip validate-pack in windows portability job ([525ab2f](https://github.com/giovannimnz/gsd-2/commit/525ab2f5f28b2a6397539fdd519b5667b8737099))
* **ci:** trim windows portability integration load ([59323c9](https://github.com/giovannimnz/gsd-2/commit/59323c92e5c6126eca5cb8974efc385e4e2dbd2a))
* **ci:** unblock windows portability follow-up ([f98543c](https://github.com/giovannimnz/gsd-2/commit/f98543cc8b895a4f6ef5e84dbb1877c8b95efae4))
* **ci:** update FILE-SYSTEM-MAP.md path after docs reorganization ([94e6b0e](https://github.com/giovannimnz/gsd-2/commit/94e6b0eb8dd1deeb85dab6d114f2d67bbd2b6b03))
* Claude Code MCP tool output rendering and real-time streaming ([fe39184](https://github.com/giovannimnz/gsd-2/commit/fe3918461902f5512da2e4f5716cd99c6b70cccf))
* Claude Code MCP tool output rendering and real-time streaming ([de52df9](https://github.com/giovannimnz/gsd-2/commit/de52df90762e9f9ce5fdee7bbfaba493964f2a98))
* **claude-code-cli:** suppress internal tool call noise ([8dfef01](https://github.com/giovannimnz/gsd-2/commit/8dfef010cf052f209565c09275f053bac760b5b3))
* **claude-code-cli:** suppress streamed internal tool noise ([442e9f1](https://github.com/giovannimnz/gsd-2/commit/442e9f14b5e404518a0ab4fe7d7c48dcd0b150fa))
* **claude-code-cli:** surface result text for success errors ([868b489](https://github.com/giovannimnz/gsd-2/commit/868b489c474215f720ba6cc44fc454744094ae34))
* **claude-code-cli:** surface result text for success errors ([ce1975f](https://github.com/giovannimnz/gsd-2/commit/ce1975fcdcc3fc69bf2d299f5ce7b89c29a340c0))
* **claude-code:** accept secure_env_collect MCP elicitation forms ([aea77be](https://github.com/giovannimnz/gsd-2/commit/aea77be8141b73d2d4b82beb6d35fe1d6cb268c2))
* **claude-code:** default GSD subagents to bypassPermissions ([#4099](https://github.com/giovannimnz/gsd-2/issues/4099) follow-up) ([3118184](https://github.com/giovannimnz/gsd-2/commit/3118184088d8fea8e6561fe18d52950bcc84e7ee))
* **claude-code:** default GSD subagents to bypassPermissions and pre-authorize safe built-ins ([#4099](https://github.com/giovannimnz/gsd-2/issues/4099) follow-up) ([e048f71](https://github.com/giovannimnz/gsd-2/commit/e048f71d5daaa06fbed61a52ff7bc2c6752a9916))
* **claude-code:** harden MCP elicitation schema handling ([8d79966](https://github.com/giovannimnz/gsd-2/commit/8d79966ffdf931a8792bdec7ec2ed4e873750b07))
* **claude-code:** pre-authorize workflow MCP tools so interactive acceptEdits mode stops blocking GSD commands ([2b9aefd](https://github.com/giovannimnz/gsd-2/commit/2b9aefd33d2d3e61fabeabe925f9a9799c1b9895)), closes [#4099](https://github.com/giovannimnz/gsd-2/issues/4099)
* **claude-code:** stop 'This command requires approval' on GSD workflow MCP tools ([#4099](https://github.com/giovannimnz/gsd-2/issues/4099)) ([4f3264a](https://github.com/giovannimnz/gsd-2/commit/4f3264abac727cc90a5d783ceea71cf395e341e1))
* **claude-code:** stop prompt context from fabricating [User]/[Assistant] turns ([8f83716](https://github.com/giovannimnz/gsd-2/commit/8f837167cb91af022f7ed1915d4451dfec79666e))
* **claude-code:** use native Windows claude lookup ([7937193](https://github.com/giovannimnz/gsd-2/commit/7937193b5ab19af8c4c784527a4486b4ba15ca95))
* **claude-code:** use native Windows claude lookup ([24816d9](https://github.com/giovannimnz/gsd-2/commit/24816d9714fc4529e353d3d70c2133b13a058455))
* **claude-code:** wrap prompt history in XML tags to stop transcript fabrication ([6b41008](https://github.com/giovannimnz/gsd-2/commit/6b4100894a8eb1b452174b735dab12dffbdd583c))
* clean up MCP tool rendering in Claude Code CLI stream ([54e96a0](https://github.com/giovannimnz/gsd-2/commit/54e96a0df00e23d6de03a510125cb00ba2ea83df))
* **cli:** address review findings for pnpm merged node_modules ([fffc039](https://github.com/giovannimnz/gsd-2/commit/fffc039e13345f38442f3f7ae3ceeece7616b503))
* **cli:** clean up stdin after sessions command readline interface closes ([862fbc8](https://github.com/giovannimnz/gsd-2/commit/862fbc8e1a1417094e2cde286ce03968eccc4260))
* **cli:** clean up stdin after sessions command readline interface closes ([357e80d](https://github.com/giovannimnz/gsd-2/commit/357e80d9f584f20da5efbbe693e25f04c02023c1)), closes [#3718](https://github.com/giovannimnz/gsd-2/issues/3718)
* **cli:** handle pnpm global installs by merging both node_modules roots ([a522e29](https://github.com/giovannimnz/gsd-2/commit/a522e29c339bb6ac82ee41e10241568efa77b2af))
* **cli:** honor custom-provider defaults before onboarding ([0840e2e](https://github.com/giovannimnz/gsd-2/commit/0840e2eb6355a9668e101c9308d46cd61f094e2f))
* **cli:** honor custom-provider defaults before onboarding ([0a30701](https://github.com/giovannimnz/gsd-2/commit/0a307018c0cf249c98b2914b82c922611e2ffc71))
* **cli:** include all internal node_modules entries in pnpm merged dir ([e61998c](https://github.com/giovannimnz/gsd-2/commit/e61998cbc92765918f25e0230ec5b56f00274445))
* **cli:** include all internal node_modules in pnpm merged dir ([72557e1](https://github.com/giovannimnz/gsd-2/commit/72557e1f8c70cd40b3c8fa73d24dabbaecaabbee))
* **cli:** preserve anthropic api provider ([5ba13f6](https://github.com/giovannimnz/gsd-2/commit/5ba13f60bdb4b4ae4056f8cc67d81b7f0c5ce08b))
* **cli:** preserve anthropic api provider ([8c7dd17](https://github.com/giovannimnz/gsd-2/commit/8c7dd1748f4d7529cede0b348bb0aa047fffb195))
* **cli:** resolve duplicate validateConfiguredModel and missing getPiDefaultModelAndProvider import ([8f437bf](https://github.com/giovannimnz/gsd-2/commit/8f437bfaf30e3c801c17330d71d895871c2b6a81))
* **cli:** resolve duplicate validateConfiguredModel import breaking all CI on main ([312f5ed](https://github.com/giovannimnz/gsd-2/commit/312f5ed11767f15c86042b9d8c7cc5cc84bf6277))
* **cli:** resolve hoisted node_modules for global installs ([a2d66f4](https://github.com/giovannimnz/gsd-2/commit/a2d66f489e4dcfb68f6e51c11a851a8c3acf706a))
* **commands:** friendly message when /gsd runs from $HOME ([cc88a01](https://github.com/giovannimnz/gsd-2/commit/cc88a01113e4a4f14ecc7c064eb281b810b525f7))
* configure GSD to listen on 0.0.0.0 for VPN access and update Apache proxy ([2b07fba](https://github.com/giovannimnz/gsd-2/commit/2b07fbaf8791c384de5d458519efb1ee268c6d88))
* correct PM2 helper function signatures ([01d96e2](https://github.com/giovannimnz/gsd-2/commit/01d96e2726fb97341985ad48838fed1b88c2c0ec))
* correct VPN DNS - gsd.atius-srv-1 → 10.1.1.2 (Apache proxy) ([fe84a7c](https://github.com/giovannimnz/gsd-2/commit/fe84a7ca282f5fe2e636ba613b2f8ef9dc664eaa))
* corrige erros de TypeScript e imports do frontend ([5f81830](https://github.com/giovannimnz/gsd-2/commit/5f8183038e94ece1824ca1c1c5cea2ed9570836a))
* discovered models override manual models in getAvailable() ([88ae184](https://github.com/giovannimnz/gsd-2/commit/88ae184afc6dbe73de9d7901174e4c682f0c6ce0))
* **discuss:** add multi-round questioning to new-project discuss phase ([6335c57](https://github.com/giovannimnz/gsd-2/commit/6335c5746cffb021323db90fc0e6a8f312b0edd4))
* **discuss:** add multi-round questioning to new-project discuss phase ([9df19ce](https://github.com/giovannimnz/gsd-2/commit/9df19cefdfb49e300d617afd1eab0da80b2c5c37)), closes [#3976](https://github.com/giovannimnz/gsd-2/issues/3976)
* **discuss:** add structuredQuestionsAvailable conditional to all gates ([52d5da7](https://github.com/giovannimnz/gsd-2/commit/52d5da7fb59112a69c579d2c9c34b1f3820672df))
* **docs:** stop pointing repo documentation to gsd.build ([0f80f32](https://github.com/giovannimnz/gsd-2/commit/0f80f32b10e6ff713a4172be8651a709805d92a0))
* **doctor:** skip key check for CLI-authenticated providers ([f6dd2b6](https://github.com/giovannimnz/gsd-2/commit/f6dd2b66e02aaa04e9d32a6a6886b2a10700a02c))
* **doctor:** skip key check for CLI-authenticated providers ([9faae2e](https://github.com/giovannimnz/gsd-2/commit/9faae2e409634895d82e89b0d5de9d8797b0d52b))
* downgrade @vitejs/plugin-react to ~5.0.0 for Node.js v22.9.0 compatibility ([c0d8de4](https://github.com/giovannimnz/gsd-2/commit/c0d8de4bf55509a5347f088a9063471b597d57c2))
* fail closed for discussion gate enforcement ([d6311b7](https://github.com/giovannimnz/gsd-2/commit/d6311b720f7f2b55586dd51794ea7f9917db5b0e))
* flush extension provider registrations before model resolution ([#1923](https://github.com/giovannimnz/gsd-2/issues/1923)) ([080c6ac](https://github.com/giovannimnz/gsd-2/commit/080c6ac1ea9d7a4ba7d40875f96e448c785e9330))
* **gates:** add mechanical enforcement for discussion question gates ([956db39](https://github.com/giovannimnz/gsd-2/commit/956db3963a21d6673bb1367177a16aa1442debfd))
* **gsd:** accept em-dash none verification rationale ([7756627](https://github.com/giovannimnz/gsd-2/commit/7756627c6238598dcb3b27a123802dc52ca0de7a))
* **gsd:** accept em-dash none verification rationale ([76383a4](https://github.com/giovannimnz/gsd-2/commit/76383a45eb83fc061076bfc529fba9f808806e4f))
* **gsd:** add memory pressure watchdog and persist stuck detection state ([#3708](https://github.com/giovannimnz/gsd-2/issues/3708)) ([abde71a](https://github.com/giovannimnz/gsd-2/commit/abde71aedaeb895eb8875cb4895b7660971ee89e))
* **gsd:** add missing directories to codebase generator exclude list ([4f338d8](https://github.com/giovannimnz/gsd-2/commit/4f338d8431adf1f8a4f566fc7a673672f6b62187))
* **gsd:** add missing dirs to codebase generator exclude list ([58193fa](https://github.com/giovannimnz/gsd-2/commit/58193fa9cfc4b9950f3f49ad72f3fd5972e6c83a))
* **gsd:** address 3 silent-crash secondary issues from [#3348](https://github.com/giovannimnz/gsd-2/issues/3348) post-[#3696](https://github.com/giovannimnz/gsd-2/issues/3696) ([#4133](https://github.com/giovannimnz/gsd-2/issues/4133)) ([27730dc](https://github.com/giovannimnz/gsd-2/commit/27730dcebdaaaee42e2a3ddc8d72b00470dd04cc))
* **gsd:** align model switching and prefs surfaces ([43b0159](https://github.com/giovannimnz/gsd-2/commit/43b01590165f413c4e907384084a116c5223365c))
* **gsd:** align model switching and prefs surfaces ([60a861f](https://github.com/giovannimnz/gsd-2/commit/60a861fc29a6ca405736b99deefe85f9b8557e31))
* **gsd:** align prompt contracts and validation flow ([cbdc0a3](https://github.com/giovannimnz/gsd-2/commit/cbdc0a35d29e42defe7283ceae0e3586aa42951c))
* **gsd:** auto-enable cmux when detected ([9cbda5e](https://github.com/giovannimnz/gsd-2/commit/9cbda5e2918bd12c3154b50e9fb4b85c2b1a4bf8))
* **gsd:** auto-enable cmux when detected instead of prompting ([1a338b8](https://github.com/giovannimnz/gsd-2/commit/1a338b80820170682940ef4562b767c73f1d0835))
* **gsd:** auto-refresh codebase cache ([ed15142](https://github.com/giovannimnz/gsd-2/commit/ed1514256fb6c5ab7faf0db804f7fd6972faf3b6))
* **gsd:** avoid false manifest and skipped-slice warnings ([7de3c7c](https://github.com/giovannimnz/gsd-2/commit/7de3c7cab5ecf5eb3f18933446feca7bce30275e))
* **gsd:** avoid false manifest and skipped-slice warnings ([dd68897](https://github.com/giovannimnz/gsd-2/commit/dd68897ad6b31e8d1a813f895bcc2ff1e4bf757e))
* **gsd:** block direct writes to gsd.db via hooks to prevent corruption ([#3674](https://github.com/giovannimnz/gsd-2/issues/3674)) ([860c5a6](https://github.com/giovannimnz/gsd-2/commit/860c5a60ba86bb2e69e74a03aceeae8ef136338b))
* **gsd:** break 3 circular dependencies in extension modules ([#3730](https://github.com/giovannimnz/gsd-2/issues/3730)) ([0a6f00d](https://github.com/giovannimnz/gsd-2/commit/0a6f00d864e52574d40165bcc73ae3faf9181f27))
* **gsd:** cast unknown gate id in test to satisfy GateId type ([70bd700](https://github.com/giovannimnz/gsd-2/commit/70bd700624ffae41f5d53fa8dad6d33825d2d3e2))
* **gsd:** classify plain 'Connection error.' as transient for auto-mode retry ([f52815a](https://github.com/giovannimnz/gsd-2/commit/f52815af80fe11b4fb340712db0fb91273a337bd))
* **gsd:** create gsd.db, runtime/, and STATE.md during init ([2142d3e](https://github.com/giovannimnz/gsd-2/commit/2142d3e94f5d6b7d5793b4b936b8ab7b7cd6d53d))
* **gsd:** create gsd.db, runtime/, and STATE.md during init ([#3880](https://github.com/giovannimnz/gsd-2/issues/3880)) ([fe3c8bf](https://github.com/giovannimnz/gsd-2/commit/fe3c8bf107b66f90ddce6bf90e4d767351069bd6))
* **gsd:** dedupe repeated notifications ([9827b15](https://github.com/giovannimnz/gsd-2/commit/9827b1537c248de63537dcc461acfc2aa2e39437))
* **gsd:** dedupe repeated notifications ([6932b48](https://github.com/giovannimnz/gsd-2/commit/6932b482e75d18198b1aff4c2108e64933431d15))
* **gsd:** detach auto start from active turns ([7a61d89](https://github.com/giovannimnz/gsd-2/commit/7a61d8919d5337011eb62ff80c9e7b7b7d4de1dd))
* **gsd:** detach auto start from active turns ([7d4969a](https://github.com/giovannimnz/gsd-2/commit/7d4969a89b3042a163d80d02d0cb38c4f68803c2))
* **gsd:** detect property-value JSON invocation errors ([8865b42](https://github.com/giovannimnz/gsd-2/commit/8865b4271e1e9aa3086a0063c4d4de51037a7e96))
* **gsd:** detect property-value JSON invocation errors ([c7130f6](https://github.com/giovannimnz/gsd-2/commit/c7130f6ac652b2e528b0e7b30cbcbef6162e8ebd))
* **gsd:** disable db mmap on darwin ([#4029](https://github.com/giovannimnz/gsd-2/issues/4029)) ([d23fe75](https://github.com/giovannimnz/gsd-2/commit/d23fe75acdcc678ae195dfe9c2402af89fbd8772))
* **gsd:** discard milestone DB and worktree state ([#4065](https://github.com/giovannimnz/gsd-2/issues/4065)) ([b4ccdb0](https://github.com/giovannimnz/gsd-2/commit/b4ccdb0ae982b43c9fc4f25ee9df4725c3d9ceb0))
* **gsd:** document flat task summary layout ([c08f16d](https://github.com/giovannimnz/gsd-2/commit/c08f16d6652ea22a1ab94bb0e206bfeb7b63d08c))
* **gsd:** document flat task summary layout ([2aa59a6](https://github.com/giovannimnz/gsd-2/commit/2aa59a6d5789a89891281191f1a7d15fdb06e0cc))
* **gsd:** enforce anti-fabrication turn-taking in discuss prompts ([06b86c6](https://github.com/giovannimnz/gsd-2/commit/06b86c6a5b8a826fa1fdd73ed4fd07fd92b51253))
* **gsd:** enforce anti-fabrication turn-taking in discuss prompts ([404f513](https://github.com/giovannimnz/gsd-2/commit/404f513177598556b8da12b6ff9988cde81ac530))
* **gsd:** enforce workflow write gates over MCP ([df21cfb](https://github.com/giovannimnz/gsd-2/commit/df21cfb64a1650cd99431654c0e38f11b1e73a0b))
* **gsd:** fail closed for discussion gate enforcement ([43234c9](https://github.com/giovannimnz/gsd-2/commit/43234c920c56dea8d3fb213b533514ed9f748c34))
* **gsd:** guard model override in minimal command contexts ([92e723c](https://github.com/giovannimnz/gsd-2/commit/92e723ca1eb39e1363b3abc433a989c49be5c03e))
* **gsd:** handle doubled-backtick pre-exec paths ([cde0e3e](https://github.com/giovannimnz/gsd-2/commit/cde0e3eb082eec8c7136d2ffd6789e69e632b430))
* **gsd:** handle doubled-backtick pre-exec paths ([a5a637a](https://github.com/giovannimnz/gsd-2/commit/a5a637a63eae85391eb3aa0a315e44267cfd49ce))
* **gsd:** harden auto merge recovery and session safety ([415cd9b](https://github.com/giovannimnz/gsd-2/commit/415cd9b7b9b3f32b721d719fc7bd8db598f26d85))
* **gsd:** harden Claude Code workflow MCP bootstrap and guidance ([bef631a](https://github.com/giovannimnz/gsd-2/commit/bef631ade3c25e4e8549a4d84eb983fbcc0b360d))
* **gsd:** harden claude-code workflow MCP bootstrap ([0e528bb](https://github.com/giovannimnz/gsd-2/commit/0e528bb7f531ab6992a79efdcca18daad88b5ae8)), closes [#3964](https://github.com/giovannimnz/gsd-2/issues/3964)
* **gsd:** heal legacy task arrays and evidence rows ([#4027](https://github.com/giovannimnz/gsd-2/issues/4027)) ([f91917c](https://github.com/giovannimnz/gsd-2/commit/f91917ce1522db875993d45c7cd3751b5bad46ea))
* **gsd:** honor /gsd model as session override across dispatch ([04fe5c9](https://github.com/giovannimnz/gsd-2/commit/04fe5c96d0fda1e6ab11b40dfec22a3ad9fa4616))
* **gsd:** ignore filename headings in parsePlan ([a452e34](https://github.com/giovannimnz/gsd-2/commit/a452e34038f3e6280e6a6df556b01df758be4dfc))
* **gsd:** ignore filename headings in parsePlan ([28e18c2](https://github.com/giovannimnz/gsd-2/commit/28e18c24aabc617e3cf72d3be721e3198b9f8972))
* **gsd:** ignore pre-existing files in task ordering ([fa099fa](https://github.com/giovannimnz/gsd-2/commit/fa099fab231f5a7226c39fa6a047062a75905841))
* **gsd:** ignore pre-existing files in task ordering ([80cfc09](https://github.com/giovannimnz/gsd-2/commit/80cfc09c5f890cb955325fcd6b86ae2a5cdf01a9))
* **gsd:** ignore prose inputs in pre-exec checks ([27bd5cf](https://github.com/giovannimnz/gsd-2/commit/27bd5cfa35eba0fc7c42c5cf7cf59a8ec5f47126))
* **gsd:** ignore prose inputs in pre-exec checks ([cbfa295](https://github.com/giovannimnz/gsd-2/commit/cbfa295831e3be2433d07b26495ae222c8ad2404))
* **gsd:** keep project db path after worktree enter ([974313b](https://github.com/giovannimnz/gsd-2/commit/974313b4fe7c0f0feb18a4351ea21516bf8f191e))
* **gsd:** keep project db path after worktree enter ([d07dd4e](https://github.com/giovannimnz/gsd-2/commit/d07dd4e79aeaa7a0ea0b5245954266dac21764d2))
* **gsd:** let doctor heal dispatch fixable warnings ([#3875](https://github.com/giovannimnz/gsd-2/issues/3875)) ([ead5fa4](https://github.com/giovannimnz/gsd-2/commit/ead5fa422010ced5a0a46934284120316b148ef6))
* **gsd:** merge enhanced context sections into standard template, clean up stale gate patterns ([51953ae](https://github.com/giovannimnz/gsd-2/commit/51953ae07d73b62849df3df6636d6d9719cf0340))
* **gsd:** normalize described expected output paths ([e59e871](https://github.com/giovannimnz/gsd-2/commit/e59e8715084f213c31ec3ea48218a5809fefadc3))
* **gsd:** normalize workingDirectory prompt paths ([#4057](https://github.com/giovannimnz/gsd-2/issues/4057)) ([195f58e](https://github.com/giovannimnz/gsd-2/commit/195f58e913b8b856d8dfd13b6d38672d31896144))
* **gsd:** open DB before bootstrap deriveState ([bcef872](https://github.com/giovannimnz/gsd-2/commit/bcef8729c576b00fc2eb1afa83c978a03816718c))
* **gsd:** open DB before bootstrap deriveState ([cfe7ec1](https://github.com/giovannimnz/gsd-2/commit/cfe7ec1e0bdc50efa1cc92229d91ffaed48c3600))
* **gsd:** preserve custom-model selection on /gsd auto bootstrap ([#4122](https://github.com/giovannimnz/gsd-2/issues/4122)) ([692c2dc](https://github.com/giovannimnz/gsd-2/commit/692c2dcf5e7212a1a1e6dfbed408e1b05fd29469))
* **gsd:** preserve custom-model selection on /gsd auto bootstrap ([#4122](https://github.com/giovannimnz/gsd-2/issues/4122)) ([e2e8502](https://github.com/giovannimnz/gsd-2/commit/e2e85029874028d3075908d5831341a3c5ab89aa))
* **gsd:** preserve experimental preferences in merges ([#3847](https://github.com/giovannimnz/gsd-2/issues/3847)) ([1c3f06f](https://github.com/giovannimnz/gsd-2/commit/1c3f06fe45836291e84209aec877ad10308b5e97))
* **gsd:** preserve paused auto badge after provider pause ([#4062](https://github.com/giovannimnz/gsd-2/issues/4062)) ([8270d33](https://github.com/giovannimnz/gsd-2/commit/8270d33382f54d140daadc5a1533aed7edea2edf))
* **gsd:** prevent double frontmatter in task SUMMARY.md from projection re-render ([#2818](https://github.com/giovannimnz/gsd-2/issues/2818)) ([b9d155b](https://github.com/giovannimnz/gsd-2/commit/b9d155b234a97c07415bc9b1f082dd842b539dac))
* **gsd:** prevent stale workflow reconcile state writes ([9f1da38](https://github.com/giovannimnz/gsd-2/commit/9f1da382f92dc0f1981bd9c99c64f315832d5aca))
* **gsd:** read existing artifacts before write ([0d3ca40](https://github.com/giovannimnz/gsd-2/commit/0d3ca407229ac94a8ac907b34ae3547293563b99))
* **gsd:** read existing artifacts before write ([04216d6](https://github.com/giovannimnz/gsd-2/commit/04216d69ba9845dfaef48b55988518ba6f129c8b))
* **gsd:** rebuild STATE.md after unit completion ([#3876](https://github.com/giovannimnz/gsd-2/issues/3876)) ([b983deb](https://github.com/giovannimnz/gsd-2/commit/b983debb75447d8e6065eb6a2dc30d80ef6a500f))
* **gsd:** reconcile stale slice rows and rebuild STATE.md before DB close ([#3658](https://github.com/giovannimnz/gsd-2/issues/3658)) ([45fadb5](https://github.com/giovannimnz/gsd-2/commit/45fadb5e8c8f05f2b3338aae8e1fc95cb542fb3c))
* **gsd:** reject empty roadmap stubs as milestone plans ([#4063](https://github.com/giovannimnz/gsd-2/issues/4063)) ([9070600](https://github.com/giovannimnz/gsd-2/commit/907060055bccba6836922c848f0ff5f2a2c41364))
* **gsd:** remove broken discuss-prepared template, inject briefs into discuss.md ([607c8bd](https://github.com/giovannimnz/gsd-2/commit/607c8bd0b0c601ab48b1eed5b1215896dbd08ca5))
* **gsd:** remove broken discuss-prepared template, inject briefs into discuss.md ([14594d0](https://github.com/giovannimnz/gsd-2/commit/14594d0af8a86c7318340612f2058ffd3463a1b6)), closes [#3934](https://github.com/giovannimnz/gsd-2/issues/3934)
* **gsd:** repair CI after branch split ([ffe245a](https://github.com/giovannimnz/gsd-2/commit/ffe245ace64f99214e8653eaaf6cea89080f421e))
* **gsd:** repair CI after branch split ([2dc8b1f](https://github.com/giovannimnz/gsd-2/commit/2dc8b1f0bf808b4432c59756505b872b10fb3a25))
* **gsd:** repair CI after branch split ([956b7ab](https://github.com/giovannimnz/gsd-2/commit/956b7ab7825296c1a38de3fe8ed5add01d54fa3f))
* **gsd:** repair DB-only milestone unpark state ([cab330d](https://github.com/giovannimnz/gsd-2/commit/cab330db8d8ec719b9f087d9c7691089e490bae5))
* **gsd:** repair DB-only milestone unpark state ([2d588b7](https://github.com/giovannimnz/gsd-2/commit/2d588b7243b5ea18db607ef20b1d4b924ad710c3))
* **gsd:** repair overlay, shortcut, and widget surfaces ([a1a3d52](https://github.com/giovannimnz/gsd-2/commit/a1a3d522349b73bcd20fc67912aa2cb8b2544492))
* **gsd:** replace empty catch block with descriptive comment ([e0a35d8](https://github.com/giovannimnz/gsd-2/commit/e0a35d807d45dc1c3480be39a6526bdf0c6358b8))
* **gsd:** replace empty catch with logWarning for CI compliance ([a274257](https://github.com/giovannimnz/gsd-2/commit/a274257a1cf7bb3f50ff50d2c275b3fb6d598b8f))
* **gsd:** require verification classes in validation prompts ([eaf62a9](https://github.com/giovannimnz/gsd-2/commit/eaf62a969f5ac58da7bcf29c549d5c32363d9334))
* **gsd:** require verification classes in validation prompts ([48803be](https://github.com/giovannimnz/gsd-2/commit/48803becd1b848c3df52a66969a1d7df7cad9114))
* **gsd:** reset db-open attempted flag on close ([#4024](https://github.com/giovannimnz/gsd-2/issues/4024)) ([d04ddbd](https://github.com/giovannimnz/gsd-2/commit/d04ddbdeb147ca530a6e3ad50e93e405ce1e8c7b))
* **gsd:** resolve resource-loader import for deployed extensions ([8a46af2](https://github.com/giovannimnz/gsd-2/commit/8a46af295a8b18ab6cc4cb8b5a2ad2b792ea8d1d))
* **gsd:** resolve resource-loader import for deployed extensions ([297896c](https://github.com/giovannimnz/gsd-2/commit/297896ceba24a78463a13cfc446a6ad8c67e8b9e))
* **gsd:** resolve workflow MCP test typing regressions ([4e3a37a](https://github.com/giovannimnz/gsd-2/commit/4e3a37a5667d8a3ce8da1092e13a691f67c1caef))
* **gsd:** restore isAutoMode plumbing and workflow-logger catch in auto-model-selection ([c75c694](https://github.com/giovannimnz/gsd-2/commit/c75c6946dee1deb3ca0b624b5703969081783656))
* **gsd:** restore milestone status db preflight ([46ef4a3](https://github.com/giovannimnz/gsd-2/commit/46ef4a3459c0509197f0fee68fba7f2619b9540e))
* **gsd:** resync managed resources on auto resume ([cdcaae6](https://github.com/giovannimnz/gsd-2/commit/cdcaae6f917d87909ebba5bf667eae7bce06dca7))
* **gsd:** resync managed resources on auto resume ([c430540](https://github.com/giovannimnz/gsd-2/commit/c4305403ea29d6a14a63349744e69670d8c016ff))
* **gsd:** route quality gates through a per-turn registry ([f015038](https://github.com/giovannimnz/gsd-2/commit/f015038482db4806fedd26272e9a534398fe6e34))
* **gsd:** scope stuck-loop forensics to auto sessions ([7cc4bb8](https://github.com/giovannimnz/gsd-2/commit/7cc4bb8688eb1290950e962273056dd1e6bd4544))
* **gsd:** scope stuck-loop forensics to auto sessions ([1682b7b](https://github.com/giovannimnz/gsd-2/commit/1682b7be7101341f4e9a3a90b066084c91e15892))
* **gsd:** serialize workflow MCP execution state ([d04a95f](https://github.com/giovannimnz/gsd-2/commit/d04a95f6d96a5681887a674a46999f1e24603775))
* **gsd:** skip reverse dependents in dispatch fallback ([0dbea85](https://github.com/giovannimnz/gsd-2/commit/0dbea85a9419805c5f3dafe8d8818c15bab341de))
* **gsd:** skip same-path planning artifact copies ([0da2a38](https://github.com/giovannimnz/gsd-2/commit/0da2a38a49cb058caaa92b98ac34ac7be831a193))
* **gsd:** skip same-path planning artifact copies ([8bac3e8](https://github.com/giovannimnz/gsd-2/commit/8bac3e88f6550f24f156cf1fa8e972bf75143318))
* **gsd:** skip skipped slices in milestone prompts ([b2005f6](https://github.com/giovannimnz/gsd-2/commit/b2005f6dd542d5b7b3990445af511d8d2cd9f61e))
* **gsd:** skip skipped slices in milestone prompts ([e9d8826](https://github.com/giovannimnz/gsd-2/commit/e9d882699c61c70ffd42d8c303b250139096f56f))
* **gsd:** snapshot new untracked files before dispatch ([3c9059e](https://github.com/giovannimnz/gsd-2/commit/3c9059ef715202957f79e23e6969bdbde3d7c382))
* **gsd:** snapshot new untracked files before dispatch ([c10ad6a](https://github.com/giovannimnz/gsd-2/commit/c10ad6a8b3910b2303b83758427ff448c4767af4))
* **gsd:** stop stale forensics context hijacks ([3f9aa88](https://github.com/giovannimnz/gsd-2/commit/3f9aa881f2e8324a5de862747128c058bbb2877d))
* **gsd:** stop stale forensics context hijacks ([3f56c74](https://github.com/giovannimnz/gsd-2/commit/3f56c74b2952fa8f6dd04f10dc262660f0cfbf8c))
* **gsd:** suppress repeated preferences section warnings ([0f8e8c4](https://github.com/giovannimnz/gsd-2/commit/0f8e8c443335ba1d6789e8b6f5a27310599ac534))
* **gsd:** suppress repeated preferences section warnings ([0cf6484](https://github.com/giovannimnz/gsd-2/commit/0cf648442ba979ccab0bc55a265e4353f1d23315))
* **gsd:** suppress workflow stderr during /gsd ([356f5b3](https://github.com/giovannimnz/gsd-2/commit/356f5b3a00c81f49a2b564eb2274908783ac6ee3))
* **gsd:** surface scoped doctor health warnings ([8f4d92b](https://github.com/giovannimnz/gsd-2/commit/8f4d92bd075c01244d48282db5962bcc8d508187))
* **gsd:** surface scoped doctor health warnings ([113aef7](https://github.com/giovannimnz/gsd-2/commit/113aef7b14e862f9697906538364da60d07e8ad3))
* **gsd:** surface warnings when DB or STATE.md init fails ([28aa7b5](https://github.com/giovannimnz/gsd-2/commit/28aa7b5fa39755e9f9b48b0ca39dea6b4d6ae7b5))
* **gsd:** tolerate corrupt task arrays ([#4056](https://github.com/giovannimnz/gsd-2/issues/4056)) ([8515079](https://github.com/giovannimnz/gsd-2/commit/851507913cef5e21a2cf5e3ed4afbc70164e1505))
* **gsd:** unblock mixed-dependency zero-dep slices ([#4025](https://github.com/giovannimnz/gsd-2/issues/4025)) ([70fb5e3](https://github.com/giovannimnz/gsd-2/commit/70fb5e3fa436e427fe3bc8e1efd6e47204ce13ca))
* **gsd:** unlock depth verification outside guided flow ([#4058](https://github.com/giovannimnz/gsd-2/issues/4058)) ([16827a0](https://github.com/giovannimnz/gsd-2/commit/16827a0a70ef2977774bf8dcc0db658b9ea55b1d))
* **gsd:** use bun for update when installed via Bun ([85f8d37](https://github.com/giovannimnz/gsd-2/commit/85f8d374484471e4ffd791583770084d88a9d274))
* **gsd:** use bun for update when installed via Bun ([#4145](https://github.com/giovannimnz/gsd-2/issues/4145)) ([5399331](https://github.com/giovannimnz/gsd-2/commit/53993317e30e190611bbb4ff995e0f0acca81207))
* **gsd:** use debugLog in catch block to satisfy empty-catch lint ([5d9bcac](https://github.com/giovannimnz/gsd-2/commit/5d9bcac9fd5dd6ca61d21c21d41da9d24d6b7e11))
* **gsd:** use milestone branch for merged worktree cleanup ([b703e66](https://github.com/giovannimnz/gsd-2/commit/b703e662711aaa8329b96a741e467417134380c0))
* **gsd:** use valid codebase refresh logger ([ea8096d](https://github.com/giovannimnz/gsd-2/commit/ea8096dadcf11b50ddaecacf662855865c81f438))
* **gsd:** wire ADR-005 infrastructure into live paths ([c1cc687](https://github.com/giovannimnz/gsd-2/commit/c1cc6876be66d304dc3686879d08e230707fd543))
* **gsd:** wire subagent_model preference through to dispatch prompt builders ([e1c09f2](https://github.com/giovannimnz/gsd-2/commit/e1c09f2a4bfaec7be802688ea9a3ac9a8c9db6ac))
* **gsd:** wire subagent_model preference through to dispatch prompt builders ([8c2a9e0](https://github.com/giovannimnz/gsd-2/commit/8c2a9e044f3e49019eb9583b22d87b10ac647ae9)), closes [#4078](https://github.com/giovannimnz/gsd-2/issues/4078)
* guard autoCommitDirtyState and restore cwd on MergeConflictError ([df002e3](https://github.com/giovannimnz/gsd-2/commit/df002e3da94658e9e796c22de4a66950345d45fa))
* guard autoCommitDirtyState and restore cwd on MergeConflictError ([#2929](https://github.com/giovannimnz/gsd-2/issues/2929)) ([e5958f0](https://github.com/giovannimnz/gsd-2/commit/e5958f0e67fc1a49fcf1d82d36c717ca44175752))
* harden auto merge recovery and session safety ([9153460](https://github.com/giovannimnz/gsd-2/commit/91534602ac940d05859870d66c72196d5e029a5f))
* harden command execution and remediate audit findings ([18ddb43](https://github.com/giovannimnz/gsd-2/commit/18ddb4327c2aa2c677acb1730e10f40df71a6ea5))
* harden pi-tui input parsing and editor focus behavior ([51c7ad0](https://github.com/giovannimnz/gsd-2/commit/51c7ad0ecbb13eee84d9d081b44a23bc05a12b51))
* harden Windows portability across runtime and tooling ([c236ea4](https://github.com/giovannimnz/gsd-2/commit/c236ea444bb206b02254bde898657e78b2fb8d2a))
* **headless:** keep idle timeout off during interactive tools ([7e231c0](https://github.com/giovannimnz/gsd-2/commit/7e231c0aa2872a8b2cd3e39bc9bbc95d712189c8))
* **headless:** keep idle timeout off during interactive tools ([8e102e7](https://github.com/giovannimnz/gsd-2/commit/8e102e7b17850952a1c84936f34df8e1a1f759d3))
* **interactive:** keep MCP tool ordering and secure env fallback prompts ([ec24142](https://github.com/giovannimnz/gsd-2/commit/ec24142a00045b655fd956a169c7a6b90792fef1))
* **interactive:** keep MCP tool output ordered and restore secure prompt fallback ([1fc645b](https://github.com/giovannimnz/gsd-2/commit/1fc645bc8b6ba4c82a4ae4a2f1034ad9e3d3c418))
* **interactive:** preserve MCP tool output stream ordering ([1ba50d3](https://github.com/giovannimnz/gsd-2/commit/1ba50d3fb6fb94fef44bbb83b59375b3d48e6b93))
* **interactive:** preserve MCP tool output stream ordering ([0c6a868](https://github.com/giovannimnz/gsd-2/commit/0c6a8686a8c3a36615583f7d8b0195169906ea2a))
* make gsd_complete_task the only execute-task summary path ([c0e6b31](https://github.com/giovannimnz/gsd-2/commit/c0e6b31c820dcc58a2af2556f969f2f35318128d))
* make gsd_complete_task the only execute-task summary path ([ac8cafb](https://github.com/giovannimnz/gsd-2/commit/ac8cafba77aa941710259bdad1732529bf494f7e))
* **mcp-server:** hydrate model credentials into env ([39eceb4](https://github.com/giovannimnz/gsd-2/commit/39eceb467e809bf98e08514b8f710c04495a4650))
* **mcp-server:** hydrate stored tool credentials on startup ([ad3371f](https://github.com/giovannimnz/gsd-2/commit/ad3371f65847fc9ff2a206b1c49043de81770764))
* **mcp-server:** importLocalModule resolves src/ paths from dist/ context ([c9a7987](https://github.com/giovannimnz/gsd-2/commit/c9a79872e282210d1851c16b69e766229dd7cc24))
* **mcp-server:** importLocalModule resolves src/ paths from dist/ context ([6f6f5e1](https://github.com/giovannimnz/gsd-2/commit/6f6f5e11af1a483cdbecaf5ccea897dab4b15309)), closes [#3954](https://github.com/giovannimnz/gsd-2/issues/3954)
* **mcp-server:** open the DB for inline workflow tools ([d4f1ee1](https://github.com/giovannimnz/gsd-2/commit/d4f1ee10b1c4129dfd1e06e5dc656771f8baac55))
* **mcp-server:** open the DB for inline workflow tools ([d7d8a97](https://github.com/giovannimnz/gsd-2/commit/d7d8a97d4c3c01b76b3ba571026d2e14899fabdf))
* **mcp-server:** URL scheme regex matches Windows drive letters ([f973ddc](https://github.com/giovannimnz/gsd-2/commit/f973ddc91a874e734fbff331255dcb191e41a585))
* **mcp-server:** URL scheme regex no longer matches Windows drive letters ([1ed3c47](https://github.com/giovannimnz/gsd-2/commit/1ed3c478aff2c8362881252b8317dc56682dff73)), closes [#3942](https://github.com/giovannimnz/gsd-2/issues/3942)
* **mcp-server:** use explicit sdk js subpaths ([7b9c4e1](https://github.com/giovannimnz/gsd-2/commit/7b9c4e166ceb4e9799eb21d232ef8e0bdd6e8ab4))
* **mcp-server:** use explicit sdk js subpaths ([30a09ed](https://github.com/giovannimnz/gsd-2/commit/30a09ed68e2b473981599d4f0992a5beb02d4cb5))
* **mcp:** expose every registered tool and fix SDK subpath resolution ([0941e63](https://github.com/giovannimnz/gsd-2/commit/0941e637a8aa74c13da292ec66ff040bc09a1bcc))
* **mcp:** harden workflow tool boundary ([54acbf7](https://github.com/giovannimnz/gsd-2/commit/54acbf7dad5ce6b6e23ed029d37648748df987e3))
* **mcp:** resolve rebase regressions in stream-adapter ([1dce1c3](https://github.com/giovannimnz/gsd-2/commit/1dce1c3ee148e1319dcfa9677901b2056d8281da))
* **mcp:** return isError flag on workflow tool execution failures ([8ab2ac5](https://github.com/giovannimnz/gsd-2/commit/8ab2ac578330e6f1945f9f9014035dea95f5e4eb))
* **mcp:** return isError flag on workflow tool execution failures ([0c467dc](https://github.com/giovannimnz/gsd-2/commit/0c467dc4ac25f9aed4b92b0e9ed072b22f2d9584))
* **mcp:** thread abort signals, restore tool fidelity, and fix subpath imports ([6aaf053](https://github.com/giovannimnz/gsd-2/commit/6aaf053047d8bce22ebe3e8c602e09ece5e57acc))
* **model-resolver:** gate saved default restore on provider readiness ([2d0b243](https://github.com/giovannimnz/gsd-2/commit/2d0b243ca8423fd95b5836b7b7a1bc0a55fa6da9))
* **model:** require provider readiness for saved default selection ([49c9296](https://github.com/giovannimnz/gsd-2/commit/49c92965993e50e4eb3f9bc2d7b380560e0e42ee))
* **models:** block unconfigured models from selection surfaces ([7a4872b](https://github.com/giovannimnz/gsd-2/commit/7a4872b65c38530a8e80dd514aa0e42d1f896bf7))
* **ollama:** add cloud auth support and resolve real context window via /api/show ([#4017](https://github.com/giovannimnz/gsd-2/issues/4017)) ([18c3441](https://github.com/giovannimnz/gsd-2/commit/18c344168b9cbbbd83719c39891c49c2fa545108)), closes [#3544](https://github.com/giovannimnz/gsd-2/issues/3544)
* **ollama:** clear footer status when provider unavailable ([4607aa4](https://github.com/giovannimnz/gsd-2/commit/4607aa4d58162526ba7ab04fa65fc1426ac8c381))
* **ollama:** clear footer status when provider unavailable ([f094657](https://github.com/giovannimnz/gsd-2/commit/f0946570dadeb40ab5ddccb831d8c9781924f919))
* persist defaultProvider when user selects Claude Code CLI in onboarding ([#4104](https://github.com/giovannimnz/gsd-2/issues/4104)) ([35d0da0](https://github.com/giovannimnz/gsd-2/commit/35d0da0561f0c0d3ad7d247bd07b24975774fc78))
* **pi-ai:** filter unavailable github copilot models ([#4031](https://github.com/giovannimnz/gsd-2/issues/4031)) ([0b7517d](https://github.com/giovannimnz/gsd-2/commit/0b7517d4deebafe3c90ec2c48c61b74d4cf4cd5f))
* **pi-ai:** recover XML parameters trapped in JSON strings ([4012f35](https://github.com/giovannimnz/gsd-2/commit/4012f35118e6aa02147df0ce106254f058a0e00a))
* **pi-ai:** recover XML parameters trapped in valid JSON strings ([608bf6e](https://github.com/giovannimnz/gsd-2/commit/608bf6e45cb19d966e193e75126e47e76fb2b0df))
* **pi-ai:** remove Anthropic OAuth flow for TOS compliance ([c2acb1f](https://github.com/giovannimnz/gsd-2/commit/c2acb1fb4a2f9ba09e00235cc06f954891b8bce2)), closes [#3952](https://github.com/giovannimnz/gsd-2/issues/3952)
* **pi-ai:** restore event stream factory export ([a5b1d8f](https://github.com/giovannimnz/gsd-2/commit/a5b1d8ff5db07beba8eea75f18ac15d82232fc07))
* **pi-ai:** restore event stream factory export ([854f61f](https://github.com/giovannimnz/gsd-2/commit/854f61f059763d376e661917b8ffaf00b670f175))
* **pi-ai:** use bearer auth for MiniMax Anthropic API ([516ed31](https://github.com/giovannimnz/gsd-2/commit/516ed31e667a976c617e2ed291b168886bc5d330))
* **pi-ai:** use bearer auth for MiniMax Anthropic API ([ff3bc6b](https://github.com/giovannimnz/gsd-2/commit/ff3bc6b5931278990208897c469600c2186884bc))
* **pi-coding-agent:** avoid oauth login for api-key providers ([d8d3eed](https://github.com/giovannimnz/gsd-2/commit/d8d3eed5a255aa4176f5b04e335e524c84b9506a))
* **pi-coding-agent:** avoid OAuth login for API-key providers ([c85757b](https://github.com/giovannimnz/gsd-2/commit/c85757b9ce5b0757ac33ed5fec115afd6ac82418))
* **pi-coding-agent:** match renderable tools case-insensitively ([b18b1b9](https://github.com/giovannimnz/gsd-2/commit/b18b1b9322ab550a8b38bf39dde21a4696d7dc2d))
* **pi-coding-agent:** match renderable tools case-insensitively ([6d96fb5](https://github.com/giovannimnz/gsd-2/commit/6d96fb560f11ddf8568d82a88906206bc31d3732))
* **pi-coding-agent:** show full OAuth login URLs ([a337eb7](https://github.com/giovannimnz/gsd-2/commit/a337eb71f1787d637ea82b54615a1f56b4f37d2f))
* **pi-coding-agent:** show full OAuth login URLs ([806a028](https://github.com/giovannimnz/gsd-2/commit/806a028856fc850f0cbfc2b6f24922dd809213c4))
* **pi-coding-agent:** skip localhost dummy key when fallback resolver provides a configured key ([fe4277c](https://github.com/giovannimnz/gsd-2/commit/fe4277c9d02499c17656af8cace39f26c3e0708e))
* **pi-coding-agent:** skip localhost dummy key when fallback resolver provides a configured key ([d0846f2](https://github.com/giovannimnz/gsd-2/commit/d0846f2c18dc089e69c8850414dbc63103153299)), closes [#4106](https://github.com/giovannimnz/gsd-2/issues/4106)
* **pi-coding-agent:** use safe compaction role markers ([450cf18](https://github.com/giovannimnz/gsd-2/commit/450cf1894c76751aa7b83fcb4128d3b552fdbc15))
* **pi-coding-agent:** use safe compaction role markers ([986946c](https://github.com/giovannimnz/gsd-2/commit/986946c34459a86a94a488ea0a57de4b1459de50))
* **pi-tui:** filter kitty keypad private-use input ([#4026](https://github.com/giovannimnz/gsd-2/issues/4026)) ([f05c631](https://github.com/giovannimnz/gsd-2/commit/f05c631797d7d19f5a0811c5af6b10488da2f114))
* **pi-tui:** harden input parsing and editor focus behavior ([1ddfd32](https://github.com/giovannimnz/gsd-2/commit/1ddfd324514b89b9bc17158475077fd6dc2214f8))
* **pi-tui:** revert contentCursorRow — use hardwareCursorRow for movement baseline ([6c91c1f](https://github.com/giovannimnz/gsd-2/commit/6c91c1f2984d3584ead77e00d7fcac621618ee05))
* **pi-tui:** revert contentCursorRow, use hardwareCursorRow as movement baseline ([160996c](https://github.com/giovannimnz/gsd-2/commit/160996c55815128b077b5e5dfe27114f2567cdd8)), closes [#3764](https://github.com/giovannimnz/gsd-2/issues/3764)
* **pi-tui:** use contentCursorRow for render movement baseline ([1b4e601](https://github.com/giovannimnz/gsd-2/commit/1b4e601c1f5dbd25b600854cc528e0d4ad1f3825))
* **pi-tui:** use contentCursorRow for render movement baseline instead of cursorRow ([2cb97c6](https://github.com/giovannimnz/gsd-2/commit/2cb97c6bfcb2fd69faaef8ee5f468c50463f8bb2)), closes [#3764](https://github.com/giovannimnz/gsd-2/issues/3764)
* **platform:** harden command execution and stabilize onboarding sync ([0b53625](https://github.com/giovannimnz/gsd-2/commit/0b5362529005a8dde07b7549354e54f501b1382f))
* prevent stale workflow reconcile state writes ([b037308](https://github.com/giovannimnz/gsd-2/commit/b03730880cd721ae02dcfc2a3fc32ab049cbf83e))
* **prompts:** harden non-bypassable gates and exclude dot-folders from scanning ([213b70c](https://github.com/giovannimnz/gsd-2/commit/213b70c18a7e7eea0e325cb6fd4e847e5212dd65))
* **prompts:** harden non-bypassable gates and exclude dot-folders from scanning ([b48aac1](https://github.com/giovannimnz/gsd-2/commit/b48aac15ea021c3c411756ec274ed517459471a9))
* **providers:** match 'out of extra usage' error and respect claude-code provider in model resolution ([#3772](https://github.com/giovannimnz/gsd-2/issues/3772)) ([0991c87](https://github.com/giovannimnz/gsd-2/commit/0991c87f4ffcd71f62df9e3fe218caf96b5de4c5))
* **providers:** match subscription block errors and respect claude-code routing ([3c26b49](https://github.com/giovannimnz/gsd-2/commit/3c26b4930e4f426edd1371460b53f85eb0f348a7))
* **providers:** route Anthropic subscription users through Claude Code CLI ([8db53c3](https://github.com/giovannimnz/gsd-2/commit/8db53c3ac41da3afa0b3407df3e2276bf706765a))
* **providers:** route Anthropic subscription users through Claude Code CLI ([#3772](https://github.com/giovannimnz/gsd-2/issues/3772)) ([d690cec](https://github.com/giovannimnz/gsd-2/commit/d690ceccd60795c47abcff23e36b9aa42ca4e219))
* **remote-questions:** cancel local TUI when remote answer wins the race ([b9c6d00](https://github.com/giovannimnz/gsd-2/commit/b9c6d00148d7272cb4562800424667a965d00ecf))
* **remote-questions:** race local TUI against remote channel ([e700a1b](https://github.com/giovannimnz/gsd-2/commit/e700a1b3c3ad4d9af484aca78e217ad3019fed26))
* **remote-questions:** race local TUI against remote channel instead of remote-only routing ([35e2845](https://github.com/giovannimnz/gsd-2/commit/35e2845f8bb517339e8b87db1e28f41077e1fa88)), closes [#3801](https://github.com/giovannimnz/gsd-2/issues/3801)
* repair overlay, shortcut, and widget surfaces ([6cd850e](https://github.com/giovannimnz/gsd-2/commit/6cd850e5095209ede414668458e228f25b4acce5))
* resolve hardcoded paths, port mismatch, and login bypass issues ([1bf0637](https://github.com/giovannimnz/gsd-2/commit/1bf0637374ece6f990d227293c5d841c8ab2351d))
* resolve merge conflicts with main for interrupted-session resume ([9c402ad](https://github.com/giovannimnz/gsd-2/commit/9c402adb9a112752b628164437d8c7b6605d26b5))
* resolve TypeScript build errors in storage migration and command ([c11fb0b](https://github.com/giovannimnz/gsd-2/commit/c11fb0b8d008f3bec9084acf193ad8043b779dd8))
* restore autoStartTime on resume + replace empty catch blocks ([#3585](https://github.com/giovannimnz/gsd-2/issues/3585)) ([01b1198](https://github.com/giovannimnz/gsd-2/commit/01b11980d928be30c5522c877fadff9f059d9fde))
* restore VPN access files deleted by auto-commit ([481b4fa](https://github.com/giovannimnz/gsd-2/commit/481b4fa783afb22e06d34dd4e92348ced46af1de))
* **retry:** guard claude-code fallback to anthropic provider only ([b0e7738](https://github.com/giovannimnz/gsd-2/commit/b0e77386b96c6cde2b046cceaeb4e8134474de01))
* route slice and validation artifacts through DB tools ([edb34ca](https://github.com/giovannimnz/gsd-2/commit/edb34ca0b0022c8a53cf8403a0c0d0226b02ea55))
* **routing:** address codex review — complete interactive bypass and accurate banner ([89d0e46](https://github.com/giovannimnz/gsd-2/commit/89d0e46402696832a7419bc8940bbba63be3185d))
* **routing:** skip dynamic routing for interactive dispatches ([#3962](https://github.com/giovannimnz/gsd-2/issues/3962)) ([7ebda5e](https://github.com/giovannimnz/gsd-2/commit/7ebda5ed711098838aa9406ce1dd05a440dca090))
* **routing:** skip dynamic routing for interactive dispatches, always show model changes ([#3962](https://github.com/giovannimnz/gsd-2/issues/3962)) ([a0eee12](https://github.com/giovannimnz/gsd-2/commit/a0eee12efc91eafb72c064d2501a6e88c013718d))
* **security:** activate auth middleware and harden shutdown/update routes ([#4023](https://github.com/giovannimnz/gsd-2/issues/4023)) ([6f65365](https://github.com/giovannimnz/gsd-2/commit/6f65365c213a7b7399dd888bc01c237037af15be)), closes [#4014](https://github.com/giovannimnz/gsd-2/issues/4014)
* **state:** prevent false degraded-mode warning when DB not yet initialized ([2367d7e](https://github.com/giovannimnz/gsd-2/commit/2367d7e8c831cfb7f22cc721a55494cacf58330a))
* **state:** prevent false degraded-mode warning when DB not yet initialized ([f4f4f6b](https://github.com/giovannimnz/gsd-2/commit/f4f4f6bb72b282dbacc0546b19d65970e0455604))
* **state:** prevent false degraded-mode warning when DB not yet initialized ([#3922](https://github.com/giovannimnz/gsd-2/issues/3922)) ([139e559](https://github.com/giovannimnz/gsd-2/commit/139e5595b2aca0c4b92d44acd1c8c0dd08631c83))
* suppress Claude Code internal tool noise in TUI ([403c561](https://github.com/giovannimnz/gsd-2/commit/403c561bc9a069fa7f073b22843a217942e72311))
* suppress streamed Claude Code internal tool noise ([1cd1e0f](https://github.com/giovannimnz/gsd-2/commit/1cd1e0ff4530ae847a31152a1b20d00710eed0d3))
* **sync-fork:** add safe mode with merge default and protected files ([9662dcc](https://github.com/giovannimnz/gsd-2/commit/9662dcc1875809d64bb85c58678209d4c1006527))
* **sync-fork:** auto-retry push with force-with-lease on divergence ([9b4b519](https://github.com/giovannimnz/gsd-2/commit/9b4b51994b17e57663b211483ef128c77457747f))
* **test:** align auto-loop test timers with 120s session timeout ([3cea7ac](https://github.com/giovannimnz/gsd-2/commit/3cea7aca4476fe0a7914d8768682aa3a7f533c8f))
* **test:** align auto-loop test timers with updated session timeout ([beb3a72](https://github.com/giovannimnz/gsd-2/commit/beb3a722dc9a8ebd3e67195b29bdcc1ffa69db37))
* **test:** update discord invite test path after docs reorganization ([2e885de](https://github.com/giovannimnz/gsd-2/commit/2e885de58b667b6c19fb758f54f2b06dab644f9c))
* TOCTOU file locking race conditions in event log and custom workflow graph ([3a83e16](https://github.com/giovannimnz/gsd-2/commit/3a83e16417b6cdb73ae9c25bc7d08691c189702b))
* TOCTOU file locking race conditions in event log and custom workflow graph ([272e3a4](https://github.com/giovannimnz/gsd-2/commit/272e3a45a13bc79352d05e301217d57a2decb0cb))
* **tui:** clear pinned latest output on turn completion ([366a872](https://github.com/giovannimnz/gsd-2/commit/366a872d01fde2b58b4503f75fc83f742d81787f))
* **tui:** clear pinned latest output on turn completion ([ad863c0](https://github.com/giovannimnz/gsd-2/commit/ad863c0e413a3f0686f2a98077906abf03362c39))
* **tui:** clear pinned output on message_end to prevent duplicate display ([7d1d9d3](https://github.com/giovannimnz/gsd-2/commit/7d1d9d3471ac03055b9bda04aee665d65393657b))
* **tui:** clear pinned output on message_end to prevent duplicate display ([598d973](https://github.com/giovannimnz/gsd-2/commit/598d973167ab8e95a4d8d4b9813ae4444e82cc07))
* **tui:** mask secure extension input values in interactive mode ([e1da5f9](https://github.com/giovannimnz/gsd-2/commit/e1da5f961f591fd61d9754410be05f5be4a0f7b3))
* **tui:** overlay subscription + Ctrl+Shift+P shortcut conflict ([d4d916a](https://github.com/giovannimnz/gsd-2/commit/d4d916add7055c3010b6a2e6782329611eae66d9))
* **tui:** overlay subscription + Ctrl+Shift+P shortcut conflict ([f07022d](https://github.com/giovannimnz/gsd-2/commit/f07022d09c970b70463ce81bed491aa4d9017da6))
* **tui:** render assistant tool calls inline with text instead of grouped at end ([6ddfa43](https://github.com/giovannimnz/gsd-2/commit/6ddfa431db6a33bb10c0fb2a24e296d55bc53110))
* **tui:** render assistant tool calls inline with text instead of grouped at end ([ad5ed4a](https://github.com/giovannimnz/gsd-2/commit/ad5ed4af4eba8a958257cae02b2aef7a80a4594f)), closes [#4144](https://github.com/giovannimnz/gsd-2/issues/4144)
* **tui:** restore pinned output above editor during tool execution ([6af264b](https://github.com/giovannimnz/gsd-2/commit/6af264b500960a085ca01d10b4cc32d1e7a0388a))
* **tui:** restore pinned output above editor during tool execution ([50cfed9](https://github.com/giovannimnz/gsd-2/commit/50cfed9d68d599bb09086aff5eb8efc3fbe7b8d8))
* **tui:** stop pinned latest-output from duplicating streaming text ([1cfd50c](https://github.com/giovannimnz/gsd-2/commit/1cfd50c144908e097446189d938b1d2e89de0572))
* **tui:** stop pinned latest-output mirror from duplicating streaming text ([a33a30e](https://github.com/giovannimnz/gsd-2/commit/a33a30e912e48f4b74f79d0999aadbe78e7ee5c7)), closes [#4120](https://github.com/giovannimnz/gsd-2/issues/4120)
* **ui:** apply anthropic-api display name to all model/provider UI surfaces ([c3bb9d5](https://github.com/giovannimnz/gsd-2/commit/c3bb9d516eed73b798d074eb23ff072428472b09))
* **ui:** apply anthropic-api display name to all remaining UI surfaces ([8e6c255](https://github.com/giovannimnz/gsd-2/commit/8e6c2551e06af6f44aa0751ee2fc3d0d503031a7))
* **ui:** display 'anthropic-api' in GSD preferences wizard provider list ([29620db](https://github.com/giovannimnz/gsd-2/commit/29620db3a49b81b665ddbf570dab1b5ed74ae93a))
* **ui:** display 'anthropic-api' in model selector to distinguish from claude-code ([ca9a2f7](https://github.com/giovannimnz/gsd-2/commit/ca9a2f79eadbaa913c5fa50d8ab4d66e5c6c2770))
* **ui:** display 'anthropic-api' in model selector to distinguish from claude-code ([13539ae](https://github.com/giovannimnz/gsd-2/commit/13539ae0153b8cff5a6de1f7a02ed3c16be2c214))
* **ui:** use model name instead of ID in display ([f23b6ec](https://github.com/giovannimnz/gsd-2/commit/f23b6ec37d58bfaa0f7203ddc973a1bb89f83e2d))
* update GSD runtime ignore patterns for team mode ([#2824](https://github.com/giovannimnz/gsd-2/issues/2824)) ([035a414](https://github.com/giovannimnz/gsd-2/commit/035a4142c436ab7c84b9097a00cb7b925d052c8b))
* **update:** fetch latest version from registry ([0026821](https://github.com/giovannimnz/gsd-2/commit/00268210ea676c88a2589ffb793bca8a7771e8be))
* **update:** fetch latest version from registry ([3df72c9](https://github.com/giovannimnz/gsd-2/commit/3df72c94a8064336fcf0c79f8160b2fd4752d125))
* use force-with-lease for push after rebase ([275c24a](https://github.com/giovannimnz/gsd-2/commit/275c24a659c794d678afec3ffc1fa7d791e9d795))
* **web-auth:** restore login screen flow and improve login input borders ([37d3ab9](https://github.com/giovannimnz/gsd-2/commit/37d3ab9b5143f5d1b72cdc48853cfb9843b2be60))
* **web-proxy:** rename middleware function to proxy for Next.js 15+ ([846ff2d](https://github.com/giovannimnz/gsd-2/commit/846ff2dee42a6dd44c4442d8f877d3caa5aaff6c))
* **web:** drop provisional pre-tool question text ([537ff24](https://github.com/giovannimnz/gsd-2/commit/537ff24bc3607672ee0e94ae3f6fe17a79fe8230))
* **web:** preserve only final ask_user_questions text ([488dfb5](https://github.com/giovannimnz/gsd-2/commit/488dfb56738a0efff761a13cf808a6cdfbbf56d7))
* **windows:** harden portability across runtime and tooling ([f1a6e82](https://github.com/giovannimnz/gsd-2/commit/f1a6e8266e75a89b09f3b8f8b63da65180aaecd3))


### Performance Improvements

* add 30s cache to visualizer to prevent heavy I/O on every request ([2808e06](https://github.com/giovannimnz/gsd-2/commit/2808e063a39b9658fc493cc2727460040bd93a33))
* add visualizer optimizations - parallel loading and cache preload ([8e4e8f8](https://github.com/giovannimnz/gsd-2/commit/8e4e8f883a47ba39ab459e1441fb37c50b2f7c87))
* **ci:** cache Next.js build artifacts with Blacksmith ([4959f7d](https://github.com/giovannimnz/gsd-2/commit/4959f7dd45f7dce63e8f71a9ab57f2bd65fd0924))
* **ci:** cache Next.js build artifacts with Blacksmith cache ([d9d2b7c](https://github.com/giovannimnz/gsd-2/commit/d9d2b7cee59bef01297591969eab8676febd834b))
* **ci:** run integration tests in parallel with build ([8e20d82](https://github.com/giovannimnz/gsd-2/commit/8e20d82449c42bdd7b0e70d5d396616b501ab548))
* **ci:** run integration tests in parallel with build ([9e82aca](https://github.com/giovannimnz/gsd-2/commit/9e82aca975ef72cbb73807818674778b92faf257))
* otimizações críticas de performance - batching e skipPollerSync ([8047eb9](https://github.com/giovannimnz/gsd-2/commit/8047eb99a38fe8be58532232632d4e47416ebe25))
* **pi-ai:** add cache_control breakpoints to tool definitions ([7c8c93b](https://github.com/giovannimnz/gsd-2/commit/7c8c93b3f3d83ef5d3c6aa4bbb055b8d48dbe9e0))
* use compiled JS for subprocess modules - 60% faster visualizer ([34b1b09](https://github.com/giovannimnz/gsd-2/commit/34b1b0953c44f375ee9f6ec7a5d5cd233ce185fe))

## [Unreleased]

## [2.73.1] - 2026-04-13

### Fixed
- **gsd**: address 3 silent-crash secondary issues from #3348 post-#3696 (#4133)
- **gsd**: tolerate corrupt task arrays (#4056)
- **gsd**: discard milestone DB and worktree state (#4065)
- **model-resolver**: gate saved default restore on provider readiness
- **tui**: stop pinned latest-output mirror from duplicating streaming text
- **gsd**: wire subagent_model preference through to dispatch prompt builders
- **ci**: address 5 pipeline integrity issues from release audit (#4119)
- **ci**: regenerate package-lock.json during version bump (#4116)
- **pi-coding-agent**: skip localhost dummy key when fallback resolver provides a configured key

### Changed
- **gsd**: delete 3 unreferenced dead files and orphaned test (#3728)

## [2.73.0] - 2026-04-13

### Added
- **pi-ai**: add Alibaba DashScope as standalone provider (#3891)
- **gsd**: add layered depth enforcement to discuss.md (#4079)

### Fixed
- **gsd**: reconcile stale slice rows and rebuild STATE.md before DB close (#3658)
- **gsd**: block direct writes to gsd.db via hooks to prevent corruption (#3674)
- **gsd**: break 3 circular dependencies in extension modules (#3730)
- **claude-code**: default GSD subagents to bypassPermissions and pre-authorize safe built-ins (#4099 follow-up)
- **gsd**: add memory pressure watchdog and persist stuck detection state (#3708)
- **state**: prevent false degraded-mode warning when DB not yet initialized (#3922)
- **async-jobs**: suppress stale follow-up for jobs consumed by await_job (#3787) (#3788)
- **gsd**: rebuild STATE.md after unit completion (#3876)
- **gsd**: let doctor heal dispatch fixable warnings (#3875)
- **gsd**: preserve experimental preferences in merges (#3847)
- **gsd**: heal legacy task arrays and evidence rows (#4027)
- **gsd**: unlock depth verification outside guided flow (#4058)
- **gsd**: preserve paused auto badge after provider pause (#4062)
- **ollama**: add cloud auth support and resolve real context window via /api/show (#4017)
- **security**: activate auth middleware and harden shutdown/update routes (#4023)
- **gsd**: normalize workingDirectory prompt paths (#4057)
- **claude-code**: pre-authorize workflow MCP tools so interactive acceptEdits mode stops blocking GSD commands
- **cli**: resolve duplicate validateConfiguredModel and missing getPiDefaultModelAndProvider import
- update GSD runtime ignore patterns for team mode (#2824)
- **gsd**: prevent double frontmatter in task SUMMARY.md from projection re-render (#2818)
- flush extension provider registrations before model resolution (#1923)
- **gsd**: reset db-open attempted flag on close (#4024)
- **gsd**: unblock mixed-dependency zero-dep slices (#4025)
- **pi-tui**: filter kitty keypad private-use input (#4026)
- **gsd**: disable db mmap on darwin (#4029)
- **gsd**: reject empty roadmap stubs as milestone plans (#4063)
- persist defaultProvider when user selects Claude Code CLI in onboarding (#4104)
- **pi-ai**: filter unavailable github copilot models (#4031)
- **claude-code**: wrap prompt history in XML tags to stop transcript fabrication
- clean up MCP tool rendering in Claude Code CLI stream

### Changed
- **pi-ai**: regenerate model registry from upstream APIs (#3887)
- require linked issue in PR template (#4112)

## [2.72.0] - 2026-04-13

### Added
- **agents**: add GSD phase guard to prevent subagent/phase conflicts
- **agents**: add 8 specialist subagents and slim pro agents
- **tui**: improve gsd overlays, shortcuts, and notification flows

### Fixed
- **ci**: build artifacts in integration-tests job
- **auto**: recover from OpenRouter credit affordability errors
- **gsd**: cast unknown gate id in test to satisfy GateId type
- **gsd**: route quality gates through a per-turn registry
- **mcp**: expose every registered tool and fix SDK subpath resolution
- **mcp**: resolve rebase regressions in stream-adapter
- **mcp**: thread abort signals, restore tool fidelity, and fix subpath imports
- **doctor**: skip key check for CLI-authenticated providers
- **tui**: overlay subscription + Ctrl+Shift+P shortcut conflict
- **models**: block unconfigured models from selection surfaces
- **ollama**: clear footer status when provider unavailable
- **gsd**: guard model override in minimal command contexts
- **model**: require provider readiness for saved default selection
- **gsd**: honor /gsd model as session override across dispatch
- **gsd**: use milestone branch for merged worktree cleanup
- **pi-coding-agent**: show full OAuth login URLs
- **auto**: add structured cooldown error and bounded retry budget
- **auto**: survive transient 429 credential cooldown in auto sessions
- **pi-coding-agent**: match renderable tools case-insensitively
- **headless**: keep idle timeout off during interactive tools
- **claude-code-cli**: surface result text for success errors
- **pi-ai**: use bearer auth for MiniMax Anthropic API
- **gsd**: scope stuck-loop forensics to auto sessions
- **gsd**: repair DB-only milestone unpark state
- **gsd**: detach auto start from active turns
- **cli**: include all internal node_modules entries in pnpm merged dir
- **gsd**: enforce anti-fabrication turn-taking in discuss prompts
- **cli**: address review findings for pnpm merged node_modules
- **cli**: handle pnpm global installs by merging both node_modules roots
- **gsd**: keep project db path after worktree enter
- **gsd**: ignore prose inputs in pre-exec checks
- **gsd**: read existing artifacts before write
- **mcp-server**: use explicit sdk js subpaths
- **cli**: preserve anthropic api provider
- **gsd**: document flat task summary layout
- **gsd**: require verification classes in validation prompts
- **mcp-server**: open the DB for inline workflow tools
- **gsd**: ignore pre-existing files in task ordering
- **gsd**: detect property-value JSON invocation errors
- **cli**: honor custom-provider defaults before onboarding
- **gsd**: dedupe repeated notifications
- **gsd**: open DB before bootstrap deriveState
- **cli**: clean up stdin after sessions command readline interface closes
- **gsd**: skip reverse dependents in dispatch fallback
- **gsd**: classify plain connection-error as transient
- **cli**: resolve hoisted node_modules for global installs
- **pi-ai**: cast test tool fixtures to any for TSchema compatibility
- **commands**: use specific validation reason in blocked-directory warning
- **commands**: show friendly message when /gsd runs from $HOME instead of unhandled error

### Changed
- **ci**: run integration tests in parallel with build
- **ci**: cache Next.js build artifacts with Blacksmith cache
- sync package-lock.json version fields to 2.68.0
- **pi-ai**: add cache_control breakpoints to tool definitions

## [2.71.0] - 2026-04-11

### Added
- **mcp-server**: add secure_env_collect tool via MCP form elicitation

### Fixed
- **tui**: clear pinned output on message_end to prevent duplicate display
- **tui**: clear pinned latest output on turn completion
- **tui**: restore pinned output above editor during tool execution
- TOCTOU file locking race conditions in event log and custom workflow graph
- **tui**: mask secure extension input values in interactive mode
- **claude-code**: harden MCP elicitation schema handling
- **claude-code**: accept secure_env_collect MCP elicitation forms
- **interactive**: keep MCP tool output ordered and restore secure prompt fallback
- **interactive**: preserve MCP tool output stream ordering
- **gsd**: resolve workflow MCP test typing regressions
- **mcp**: return isError flag on workflow tool execution failures
- **discuss**: add structuredQuestionsAvailable conditional to all gates
- **discuss**: add multi-round questioning to new-project discuss phase
- **gsd**: harden claude-code workflow MCP bootstrap
- **web**: drop provisional pre-tool question text

### Changed
- extract deriveStateFromDb logic into composable helpers
- **pr**: drop web-layer changes from MCP stream-order fix

## [2.70.1] - 2026-04-11

### Fixed
- **routing**: address codex review — complete interactive bypass and accurate banner
- **routing**: skip dynamic routing for interactive dispatches, always show model changes (#3962)
- **ci**: trim windows portability integration load
- **ci**: narrow windows portability coverage
- **ci**: skip validate-pack in windows portability job
- **ci**: unblock windows portability follow-up
- **windows**: harden portability across runtime and tooling
- **auto**: use pathToFileURL for cross-platform import and reconcile regression test
- **auto**: resolve resource-loader.js from GSD_PKG_ROOT on resume (#3949)
- **mcp-server**: importLocalModule resolves src/ paths from dist/ context
- **gsd**: surface scoped doctor health warnings
- **gsd**: skip skipped slices in milestone prompts
- **gsd**: handle doubled-backtick pre-exec paths
- **update**: fetch latest version from registry

## [2.70.0] - 2026-04-10

### Added
- **mcp-server**: expose ask_user_questions via elicitation

### Fixed
- **pi-ai**: remove Anthropic OAuth flow for TOS compliance
- **mcp-server**: hydrate model credentials into env
- **mcp-server**: hydrate stored tool credentials on startup
- **gsd**: auto-enable cmux when detected instead of prompting
- **mcp-server**: URL scheme regex no longer matches Windows drive letters

## [2.69.0] - 2026-04-10

### Added
- **gsd**: implement ADR-005 multi-model provider and tool strategy
- **gsd**: complete ADR-004 capability-aware model routing implementation

### Fixed
- **gsd**: add missing directories to codebase generator exclude list
- **gsd**: wire ADR-005 infrastructure into live paths
- **gsd**: replace empty catch with logWarning for CI compliance
- **gsd**: merge enhanced context sections into standard template, clean up stale gate patterns
- **gsd**: remove broken discuss-prepared template, inject briefs into discuss.md

## [2.68.1] - 2026-04-10

### Fixed
- **ci**: update FILE-SYSTEM-MAP.md path after docs reorganization
- **test**: update discord invite test path after docs reorganization
- **gsd**: resolve resource-loader import for deployed extensions

## [2.68.0] - 2026-04-10

### Added
- expose slice replanning over workflow MCP
- expose milestone workflow tools over MCP
- expose slice completion over workflow MCP
- expose task completion alias over workflow MCP
- expose GSD planning tools over MCP
- gate workflow MCP units by provider transport capabilities
- expose core GSD workflow tools over MCP
- add contextual tips system for TUI and web terminal

### Fixed
- **state**: prevent false degraded-mode warning when DB not yet initialized
- **gsd**: use debugLog in catch block to satisfy empty-catch lint
- **gsd**: avoid false manifest and skipped-slice warnings
- **gsd**: replace empty catch block with descriptive comment
- guard autoCommitDirtyState and restore cwd on MergeConflictError (#2929)
- Claude Code MCP tool output rendering and real-time streaming
- **gsd**: surface warnings when DB or STATE.md init fails
- **gsd**: create gsd.db, runtime/, and STATE.md during init (#3880)
- **gsd**: suppress workflow stderr during /gsd
- **gsd**: enforce workflow write gates over MCP
- restore autoStartTime on resume + replace empty catch blocks (#3585)
- **mcp**: harden workflow tool boundary
- **gsd**: accept em-dash none verification rationale
- **gsd**: resync managed resources on auto resume
- **gsd**: stop stale forensics context hijacks
- **gsd**: serialize workflow MCP execution state
- **gsd**: restore milestone status db preflight
- **claude-code-cli**: suppress streamed internal tool noise
- **gsd**: skip same-path planning artifact copies
- **claude-code-cli**: suppress internal tool call noise
- **pi-coding-agent**: avoid oauth login for api-key providers
- **gsd**: snapshot new untracked files before dispatch
- **platform**: harden command execution and stabilize onboarding sync
- **pi-ai**: restore event stream factory export
- **gsd**: use valid codebase refresh logger
- **gsd**: auto-refresh codebase cache
- **gsd**: align model switching and prefs surfaces
- route slice and validation artifacts through DB tools
- make gsd_complete_task the only execute-task summary path
- **docs**: stop pointing repo documentation to gsd.build
- add activeEngineId and activeRunDir to PausedSessionMetadata interface
- **gsd**: address QA round 4
- **gsd**: address QA round 3
- **gsd**: address QA round 2
- **gsd**: address QA round 1
- **gsd**: address review feedback from trek-e
- **gsd**: assess recovery from paused worktree state
- **gsd**: satisfy extension typecheck for interrupted recovery
- **gsd**: restore hook dispatch export and guided flow imports
- **gsd**: clear stale paused metadata in guided flow
- **gsd**: preserve interrupted-session resume mode
- preserve explicit interrupted-session resume mode
- preserve step-mode and suppress stale paused resumes
- suppress stale interrupted-session resume prompts

### Changed
- harden workflow MCP executor loading
- **ci**: add weekly workflow to regenerate model registry
- **deps**: refresh audited package locks

## [2.67.0] - 2026-04-09

### Added
- **context**: implement R005 decision scope cascade and derive scope from slice metadata
- **M005**: Tiered Context Injection - relevance-scoped context with 65%+ reduction

### Fixed
- **test**: align auto-loop test timers with updated session timeout
- **gsd**: repair CI after branch split
- **gsd**: repair CI after branch split
- **gsd**: repair CI after branch split
- **gsd**: fail closed for discussion gate enforcement
- **gsd**: harden auto merge recovery and session safety
- **gsd**: repair overlay, shortcut, and widget surfaces
- **gsd**: prevent stale workflow reconcile state writes
- **gsd**: align prompt contracts and validation flow
- **pi-tui**: harden input parsing and editor focus behavior
- **remote-questions**: cancel local TUI when remote answer wins the race
- **auto**: increase session timeout to 120s and treat timeout as recoverable pause (#3767)
- **ui**: apply anthropic-api display name to all model/provider UI surfaces
- **ui**: display 'anthropic-api' in GSD preferences wizard provider list
- **remote-questions**: race local TUI against remote channel instead of remote-only routing
- **ui**: display 'anthropic-api' in model selector to distinguish from claude-code
- **gates**: add mechanical enforcement for discussion question gates
- **prompts**: harden non-bypassable gates and exclude dot-folders from scanning
- **gsd**: ignore filename headings in parsePlan
- **providers**: match 'out of extra usage' error and respect claude-code provider in model resolution (#3772)
- **pi-ai**: recover XML parameters trapped in JSON strings
- **retry**: guard claude-code fallback to anthropic provider only
- **providers**: route Anthropic subscription users through Claude Code CLI (#3772)
- **claude-code**: use native Windows claude lookup
- **gsd**: suppress repeated preferences section warnings
- **gsd**: normalize described expected output paths
- **auto**: resilient transient error recovery — defer to Core RetryHandler and fix cmdCtx race

## [2.66.1] - 2026-04-08

### Fixed
- **pi-tui**: revert contentCursorRow, use hardwareCursorRow as movement baseline
- **pi-tui**: use contentCursorRow for render movement baseline instead of cursorRow
- **gsd**: add logWarning to empty catch block in orphaned worktree cleanup
- **gsd**: add consecutiveFinalizeTimeouts to LoopState in journal tests
- **gsd**: add escalation and unit-detach guards to finalize timeout handlers
- **gsd**: add timeout guard around postUnitPreVerification to prevent auto-loop hang
- **gsd**: OS-specific keyboard shortcut hints via formatShortcut helper
- **subagent**: support list-style tools frontmatter
- clear autocomplete rows from content bottom
- parse annotated pre-exec file paths
- **gsd**: add orphaned milestone branch audit at auto-mode bootstrap

## [2.66.0] - 2026-04-08

### Added
- **gsd**: add fast path for queued milestone discussion
- **gsd**: add /gsd show-config command
- **reactive**: graph diagnostics and subagent_model config
- **dispatch**: parallel research slices and parallel milestone validation
- **parallel**: worker model override for parallel milestone workers

### Fixed
- **gsd**: validate depth verification answer before unlocking write-gate
- **gsd**: revert unknown artifact check to warn-and-proceed
- **gsd**: add missing cmd field to test base WorkflowEvent
- **gsd**: address remaining adversarial review findings for wave 3
- **gsd**: detect concurrent event log growth during reconcile
- **gsd**: address adversarial review findings for wave 3
- **gsd**: address adversarial review findings for wave 2
- **gsd**: address adversarial review findings for wave 1
- **gsd**: WAL-safe migration backup + stronger regression tests
- **gsd**: consistency and cleanup (wave 5/5)
- **gsd**: write safety — atomic writes and randomized tmp paths (wave 4/5)
- **gsd**: session and recovery robustness (wave 3/5)
- **gsd**: event log and reconciliation robustness (wave 2/5)
- **gsd**: critical state machine data integrity fixes (wave 1/5)
- **gsd**: critical state machine data integrity fixes (wave 1/5)
- **gsd**: remove ecosystem research stub and address adversarial review
- **gsd**: suppress model change notification in auto-mode unless verbose
- **gsd**: exclude task.files from checkTaskOrdering to prevent false positives
- **state**: skip ghost check for queued milestones in registry build
- **ci**: replace empty catch blocks and raw stderr with logWarning
- **logging**: add debugLog to empty catch in reopen-milestone
- **state-machine**: 9 resilience fixes + 86 regression tests (#3161)
- **gsd**: add incremental persistence to discuss prompts
- replace empty catch with logWarning for silent-catch-diagnostics test
- **test**: escape regex metacharacters in skip-by-preference pattern test
- **test**: search for numbered step definitions in prompt ordering test
- **test**: update notes loop test for notesVisible guard behavior
- **test**: update action count for note captures now included in results
- **test**: remove extraneous test file from wrong branch
- **test**: update worktree sync tests to use separate milestone IDs
- **gsd**: use valid LogComponent type for stale branch guard warning
- **test**: update rogue detection test for auto-remediation behavior
- **test**: update stuck-planning test to expect executing after reconciliation
- **test**: update file path consistency tests for inputs-only checking
- **test**: add CONTEXT file to queued milestone ghost detection test
- **test**: update needs-remediation test to expect validating-milestone phase
- **gsd**: import all-done milestones as complete during DB migration
- **gsd**: allow milestone completion when validation skipped by preference
- **gsd**: set slice sequence at all three insertion sites
- **gsd**: four prompt/runtime fixes for completion and session stability
- **gsd**: default insertMilestone status to queued instead of active
- **gsd**: suppress repeated frontmatter YAML parse warnings
- **gsd**: normalize list inputs in complete-task + fix roadmap dep parsing
- **gsd**: open DB before status derivation + respect isolation:none in quick
- **gsd**: add .bg-shell/ to baseline gitignore patterns
- **tui**: prevent Enter key infinite loop in interview notes mode
- **provider**: handle Enter key to initiate auth setup in provider manager
- **gsd**: cap run-uat dispatch attempts to prevent infinite replay loop
- **mcp**: use createRequire to resolve SDK wildcard subpath imports
- **gsd**: mark note captures as executed in executeTriageResolutions
- **gsd**: validate main_branch preference exists before using in merge
- **gsd**: handle deleted cwd in projectRoot to prevent ENOENT crash
- **gsd**: skip current milestone in syncWorktreeStateBack to prevent merge conflicts
- **gsd**: add structuredQuestionsAvailable conditional to slice discuss
- **gsd**: restore full tool set after discuss flow scoping
- **gsd**: tighten verifyExpectedArtifact to prevent rogue-write false positives
- **gsd**: add verification gate to complete-slice tool
- **gsd**: fix pre-execution-checks false positives from backticks and task.files
- **gsd**: stop renderAllProjections from overwriting authoritative PLAN.md
- **gsd**: auto-checkout to main when isolation:none finds stale milestone branch
- **gsd**: auto-remediate stale slice DB status when SUMMARY exists on disk
- **gsd**: open DB on demand in gsd_milestone_status for non-auto sessions
- **gsd**: detect phantom milestones from abandoned gsd_milestone_generate_id
- **gsd**: force re-validation when verdict is needs-remediation
- **gsd**: exclude closed slices from findMissingSummaries check
- **gsd**: recover from stale lockfile after crash or SIGKILL
- **gsd**: add createdAt timestamp and 30s age guard to staleness check
- **gsd**: clear stale pendingAutoStart after /clear interrupts discussion
- **gsd**: suppress misleading warnings for expected ENOENT/EISDIR conditions
- **gsd**: extract real error from message content when errorMessage is useless
- **gsd**: extract real error from message content when errorMessage is useless
- **gsd**: show accurate pause message for queued-user-message skip
- **gsd**: treat queued-user-message skip as non-retryable interruption
- **gsd**: recognize "Not provided." default in isVerificationNotApplicable
- **gsd**: discoverManifests skips symlinked extension directories
- **gsd**: recognize "Not provided." default in isVerificationNotApplicable
- **gsd**: reconcile plan-file tasks into DB when planner skips persistence (#3600)
- **gsd**: use isClosedStatus() in dispatch guard instead of raw complete check
- **browser-tools**: make sharp an optional lazy dependency
- **gsd**: pass required arguments in defer-milestone-stamp test
- **gsd**: replace remaining empty catch with logWarning
- **gsd**: use logWarning instead of raw stderr in catch blocks
- **gsd**: log error instead of empty catch in STATE.md rebuild
- **gsd**: log error instead of empty catch in skip_slice
- **gsd**: cast milestone classification to string for type safety
- **gsd**: treat zero-slice roadmap as pre-planning in guided flow
- **gsd**: rebuild STATE.md after skip-slice and strengthen rethink prompt
- **gsd**: use main_branch preference in worktree creation
- **gsd**: stamp defer and milestone captures as executed after triage
- **tui**: treat absolute file paths as plain text, not commands
- **tui**: break infinite re-render loop for images in cmux
- **gsd**: rebuild STATE.md before guided-flow dispatch
- **gsd**: defer queued shells in active milestone selection
- **retry**: prevent 429 quota cascade and 30-min lockout
- **gsd**: add fastPathInstruction to buildDiscussMilestonePrompt loadPrompt call

### Changed
- auto-commit after quick-task
- auto-commit after quick-task
- auto-commit after quick-task
- auto-commit after quick-task
- auto-commit after quick-task
- auto-commit after quick-task
- auto-commit after quick-task

## [2.65.0] - 2026-04-07

### Added
- **gsd**: persistent notification panel with TUI overlay, widget, and web API
- **gsd**: wire blocking behavior and strict mode for enhanced verification
- **gsd**: add post-execution cross-task consistency checks
- **gsd**: add pre-execution plan verification checks

### Fixed
- **gsd**: wrap long notification messages and fit overlay to content
- **gsd**: remove background color from backdrop, fix message truncation
- **gsd**: restore consistent overlay height to prevent ghost artifacts
- **gsd**: improve notification overlay backdrop and content-fit sizing
- **gsd**: only unlink notification lock when owned, prevent foreign lock deletion
- **gsd**: add backdrop dimming and viewport padding to notification overlay
- **gsd**: add intent + phase guards to resume context fallback (#3615)
- **gsd**: inject task context for unstructured resume prompts (#3615)
- **pi-coding-agent**: restore extension tools after session switch (#3616)
- **agent-loop**: schema overload cap ignores bash execution errors (#3618)
- **bg-shell**: prevent signal handler accumulation + cap alert queue
- **gsd**: coerce plain-string provides field to array in complete-slice (#3585)
- address PR #3468 review findings
- **gsd**: persist autoStartTime across session resume so elapsed timer survives /exit
- **gsd**: add enhanced_verification preferences to mergePreferences
- **headless**: treat discuss and plan as multi-turn commands

### Changed
- **interactive**: cap rendered chat components + kill orphan descendants
- **tui**: render-skip, frame isolation, Text cache guard, dispose

## [2.64.0] - 2026-04-06

### Added
- **gsd**: add LLM safety harness for auto-mode damage control
- **ollama**: native /api/chat provider with full option exposure
- **parallel**: slice-level parallelism with dependency-aware dispatch (#3315)
- **mcp-client**: add OAuth auth provider for HTTP transport (#3295)

### Fixed
- **ui**: remove 200-column cap on welcome screen width
- address adversarial review findings for #3576
- **gsd**: replace hardcoded agent skill paths with dynamic resolution (#3575)
- **headless**: sync resources and use agent dir for query
- **cli**: show latest version and bypass npm cache in update check
- **gsd**: follow CONTRIBUTING standards for #3565
- **gsd**: address Codex adversarial review findings for #3565
- **gsd**: coerce string arrays to objects in complete-slice/task tools (#3565)
- **gsd**: harden flat-rate routing guard against alias/resolution gaps
- **pi-coding-agent**: register models.json providers and await Ollama probe in headless mode
- **ollama**: use apiKey auth mode to avoid streamSimple crash
- **gsd**: disable dynamic model routing for flat-rate providers
- **gsd**: address Codex adversarial review findings
- **gsd**: prevent LLM from querying gsd.db directly via bash (#3541)
- **gsd**: seed requirements table from REQUIREMENTS.md on first update
- **gsd**: inject S##-CONTEXT.md from slice discussion into all prompt builders
- **cli**: guard model re-apply against session restore and async rejection
- **pi-coding-agent**: resolve model fallback race that ignores configured provider (#3534)
- **detection**: add xcodegen and Xcode bundle support to project detection (#1882)
- **perf**: share jiti module cache across extension loads (#3308)
- **resource-sync**: prune removed bundled subdirectory extensions on upgrade (#1972)
- recognize U+2705 checkmark emoji as completion marker in prose roadmaps (#1897)
- **web**: use safePackageRootFromImportUrl for cross-platform package root (#1881) (#1893)
- isolate CmuxClient stdio to prevent TUI hangs in CMUX (#3306)
- worktree health check walks parent dirs for monorepo support (#3313)
- **gsd**: promote milestone status from queued to active in plan-milestone (#3317)
- **worktree**: correct merge failure notification command from /complete-milestone to /gsd dispatch complete-milestone (#1901)
- detect and block Gemini CLI OAuth tokens used as API keys (#3296)
- **auto**: break retry loop on tool invocation errors (malformed JSON) (#3298)
- **git**: use git add -u in symlink .gsd fallback to prevent hang (#3299)
- handle complete-slice context exhaustion to unblock downstream slices (#3300)
- cap consecutive tool validation failures to prevent stuck-loop (#3301)
- make enrichment tool params optional for limited-toolcall models (#3302)
- add filesystem safety guard to complete-slice.md (#3304)
- **extensions**: use bundledExtensionKeys for conflict detection instead of broken path heuristic (#3305)
- scope tools during discuss flows to prevent grammar overflow (#3307)
- **preferences**: warn on silent parse failure for non-frontmatter files (#3310)
- track remote-questions in managed-resources manifest (#3312)
- **auto**: add timeout guard for postUnitPostVerification in runFinalize (#3314)
- **gsd**: handle large markdown parameters in complete-milestone JSON parsing (#3316)
- **metrics**: deduplicate idle-watchdog entries and fix forensics false-positives (#1973)
- prevent milestone/slice artifact rendering corruption (#3293)
- **doctor**: strip --fix flag before positional parse (#1919) (#1926)
- resolve external-state worktree DB path (#2952) (#3303)
- **gsd**: worktree teardown path validation prevents data loss (#3311)
- prevent auto-mode from dispatching deferred slices (#3309)
- preserve completed slice status on plan-milestone re-plan (#3318)
- reopen DB on cold resume, recognize heavy check mark (#3319)
- dashboard model label shows dispatched model, not stale previous unit (#3320)

### Changed
- **gsd**: remove copyright line from test file
- **gsd**: trim promptGuidelines to 1 line to reduce per-turn token cost
- **web**: consolidate subprocess boilerplate into shared runner (#1899)

## [2.63.0] - 2026-04-05

### Added
- **mcp-server**: add 6 read-only tools for project state queries (#3515)

### Fixed
- **gsd**: enrich vague diagnostic messages with root-cause context
- **test**: reset dedup cache between ask-user-freetext tests
- **db**: delete orphaned WAL/SHM files alongside empty gsd.db (#2478)
- **gsd**: prevent auto-wrapup from interrupting in-flight tool calls (#3512)
- **gsd**: handle bare model IDs in resolveDefaultSessionModel (#3517)
- **gsd**: wrap decision and requirement saves in transaction to prevent ID races
- **gsd**: prefer PREFERENCES.md over settings.json for session bootstrap model (#3517)
- **gsd**: add Claude Code official skill directories to skill resolution
- **dedup**: hash full question payload, not just IDs
- **gsd**: prevent duplicate ask_user_questions dispatches with per-turn dedup cache
- **pi-ai**: extend repairToolJson to handle XML tags and truncated numbers
- **pi-coding-agent**: cancel stale retries after model switch

### Changed
- untrack .repowise/ and add to .gitignore

## [2.62.1] - 2026-04-05

### Fixed
- **gsd**: gate steer worktree routing on active session, fix messaging
- **gsd**: resolve steer overrides to worktree path when worktree is active

## [2.62.0] - 2026-04-04

### Added
- **gsd**: enhance /gsd codebase with preferences, --collapse-threshold, and auto-init
- **01-05**: fire before_model_select hook, add verbose scoring output, load capability overrides
- **01-04**: register before_model_select placeholder handler in GSD hooks
- **01-04**: add BeforeModelSelectEvent to extension API and wire emission
- **01-03**: wire taskMetadata from selectAndApplyModel to resolveModelForComplexity
- **01-03**: insert STEP 2 capability scoring into resolveModelForComplexity
- **01-01**: add taskMetadata to ClassificationResult and export extractTaskMetadata
- **01-01**: add capability types, data tables, and scoring functions to model-router

### Fixed
- **gsd**: add codebase validation in validatePreferences so preferences are not silently dropped
- **test**: update db-path-worktree-symlink test for simplified diagnostic logging
- **gsd**: update tests for errors-only audit persistence, fix empty catch blocks
- **gsd**: harden audit log persistence — errors-only, sanitized, demote probe warnings
- **gsd**: address adversarial review findings on workflow-logger migration
- **gsd**: fail-closed stop guard, harden backtrack parsing, fix prompt params
- **gsd**: add diagnostic logging to empty catch blocks in auto-mode
- **lsp**: add legacy alias for renamed kotlin-language-server key
- break infinite notes loop when selecting "None of the above"
- align defaultRoutingConfig capability_routing to true
- **pi-coding-agent**: upgrade Kotlin LSP to official Kotlin/kotlin-lsp
- **test**: use correct RequirementCounts type fields in edge case tests
- **remote-questions**: fire configured channels in interactive mode

### Changed
- **gsd**: migrate all catch blocks to centralized workflow-logger
- init gsd

## [2.61.0] - 2026-04-04

### Added
- stop/backtrack capture classifications for milestone regression (#3488)
- GSD context optimization with model routing and context masking

## [2.60.0] - 2026-04-04

### Added
- add /btw skill — ephemeral side questions from conversation context

### Fixed
- **btw**: remove LLM-specific references from skill description

## [2.59.0] - 2026-04-03

### Added
- **extensions**: add Ollama extension for first-class local LLM support (#3371)
- **doctor**: stale commit safety check with gsd snapshot and auto-cleanup
- **extensions**: wire up topological sort and unified registry filtering (#3152)
- **widget**: add last commit display and dashboard layout improvements (#3226)
- **model-routing**: enable dynamic routing by default (#3120)
- **vscode**: sidebar redesign, SCM provider, checkpoints, diagnostics [3/3]
- **splash**: add remote channel indicator to welcome screen tools row
- stream full text and thinking output in headless verbose mode (#2934)
- **gsd**: add codebase map — structural orientation for fresh agent contexts

### Fixed
- **worktree**: resolve merge conflict for PR #3322 — adopt comprehensive pre-merge cleanup
- **merge**: clean stale MERGE_HEAD before squash merge (#2912)
- **state**: always run disk→DB reconciliation when DB is available (#2631)
- **git-service**: fix merge-base ancestry check and .gsd/ leakage in snapshot absorption
- **extensions**: update provides.hooks in 7 extension manifests to match actual registrations (#3157)
- surface nativeCommit errors in reconcileMergeState instead of silently swallowing (#3052)
- **parallel**: scope commits to milestone boundaries in parallel mode (#3047)
- add windowsHide to all web-mode subprocess spawns (#2628) (#3046)
- skip auto-mode pause on empty-content aborted messages (#2695) (#3045)
- detect and remove nested .git dirs in worktree cleanup to prevent data loss (#3044)
- prevent data loss when git isolation default changes (#2625) (#3043)
- **read-tool**: clamp offset to file bounds instead of throwing (#3007) (#3042)
- **gsd**: preserve queued milestones with worktrees in ghost detection (#3041)
- **compaction**: add chunked fallback when messages exceed model context window (#3038)
- preserve interactive terminal across tab switches and project changes (#3055)
- call cleanupQuickBranch on turn_end to squash-merge quick branch back (#3054)
- align run-uat artifact path to ASSESSMENT, preventing false stuck retries (#3053)
- replace invalid Discord invite links with canonical URL (#3056)
- add Windows shell guard to remaining spawn sites (#3058)
- route `gsd auto` to headless runner to prevent hang on piped stdin/stdout (#3057)
- respect .gitignore for .gsd/ in rethink prompt (#3059)
- migrate unit ownership from JSON to SQLite to eliminate read-modify-write race (#3061)
- **roadmap**: handle numbered, bracketed, and indented prose H3 headers in slice parser (#3063)
- add worktree-merge to resolveModelWithFallbacksForUnit switch and update KNOWN_UNIT_TYPES (#3066)
- clean up MERGE_HEAD on all error paths in mergeMilestoneToMain (#2912) (#3068)
- prevent LLM from confusing background task output with user input (#3069)
- add openai-codex provider and modern OpenAI models to MODEL_CAPABILITY_TIER and cost tables (#3070)
- preserve active tab when switching projects (#3071)
- include project name in desktop notifications (#3072)
- recover from many-image dimension overflow by stripping older images (#3075)
- resolve bare model IDs to anthropic over claude-code provider (#3076)
- **auto**: move selectAndApplyModel before updateProgressWidget (#3079)
- detect project relocation and recover state without data loss (#3080)
- add free-text input to ask-user-questions when "None of the above" is selected (#3081)
- block work execution during /gsd queue mode (#2545) (#3082)
- detect worktree basePath in gsdRoot() to prevent escaping to project root (#3083)
- invalidate stale quick-task captures across milestone boundaries (#3084)
- defer model validation until after extensions register (#3089)
- repair YAML bullet lists in malformed tool-call JSON (#3090)
- unify SUMMARY.md render paths for projection fidelity (#3091)
- chat mode misrepresents terminal output, looks stuck, omits user messages (#3092)
- resolve 4 state corruption bugs in milestone/slice completion (#2945) (#3093)
- isolate guided-flow session state and key discussion milestone queries (#2985) (#3094)
- **guided-flow**: route dispatchWorkflow through dynamic routing pipeline (#3153)
- skip external state migration inside git worktrees (#2970) (#3227)
- coerce non-numeric strings in DB columns during manifest serialization (#2962) (#3229)
- route allDiscussed and zero-slices paths to queued milestone discussion (#3150) (#3230)
- use loose equality for null checks in secure_env_collect (#2997) (#3231)
- prevent prompt explosion from $' in template replacement values (#2968) (#3232)
- resolve OAuth API key in buildMemoryLLMCall via modelRegistry (#2959) (#3233)
- **forensics**: read completion status from DB instead of legacy file (#3129) (#3234)
- use camelCase parameter names in execute-task and complete-slice prompts (#2933) (#3236)
- check bootstrap completeness in init wizard gate, not just .gsd/ existence (#2942) (#3237)
- specify write tool for PROJECT.md in milestone/slice prompts (#3238)
- widen completing-milestone gate to accept "None required" and similar phrasings (#2931) (#3239)
- prevent ask_user_questions from poisoning auto-mode dispatch (#2936) (#3240)
- guard null s.currentUnit in runUnitPhase closeout after stopAuto race (#2939) (#3241)
- replace `web_search` with `search-the-web` in prompts and agent frontmatter (#2920) (#3245)
- preserve milestone title in upsertMilestonePlanning when DB row pre-exists (#2879) (#3247)
- invalidate stale milestone validation on roadmap reassessment (#2957) (#3242)
- **discuss**: add roadmap fallback when DB is open but empty (#2892) (#3244)
- integrate Codex & Gemini CLI into provider routes and rate-limit handling (#2922) (#3246)
- **error-classifier**: widen STREAM_RE to cover all 7 V8 JSON parse error variants (#2916) (#3243)
- prevent git stash from destroying queued milestone CONTEXT files (#2505) (#3273)
- skip staleness rebuild in npm tarball installs (#2877) (#3250)
- **parallel**: check worktree DB for milestone completion in merge (#2812) (#3256)
- make claude-code provider stateful with full context and sidechain events (#2859) (#3254)
- **worktree**: preserve non-empty gsd.db during sync to prevent truncation (#2815) (#3255)
- align @gsd/native module type with compiled output (#3253)
- parse hook/* completed-unit keys correctly in forensics + doctor (#2826) (#3252)
- copy mcp.json into auto-mode worktrees (#2791) (#3251)
- add gsd_requirement_save and upsert path for requirement updates (#3249)
- handle pause_turn stop reason to prevent 400 errors with native web search (#2869) (#3248)
- use authoritative milestone status in web roadmap (#2807) (#3258)
- classify long-context entitlement 429 as quota_exhausted, not rate_limit (#2803) (#3257)
- **docs**: use ~/.pi/agent/extensions/ for community extension install path (#3131) (#3259)
- add disk→DB slice reconciliation in deriveStateFromDb (#2533) (#3262)
- run forensics duplicate detection before investigation (#2704) (#3260)
- skip TUI render loop on non-TTY stdout to prevent CPU burn (#3095) (#3263)
- persist forensics report context across follow-up turns (#2941) (#3261)
- invalidate workspace state on turn_end so milestones list stays current (#2706) (#3266)
- eliminate 3 recurring doctor audit false positives (#3105) (#3264)
- **web**: reconcile auto-mode state with on-disk lock in dashboard (#2705) (#3265)
- treat ghost milestones as ineligible for parallel execution (#2501) (#3268)
- redirect auto-mode to headless when stdout is piped (#2732) (#3269)
- attempt VACUUM recovery when initSchema fails with corrupt freelist (#2519) (#3270)
- resolve db_unavailable loop in worktree/symlink layouts (#2517) (#3271)
- correct OAuth fallback request shape for google_search (#2963) (#3272)
- prevent UAT stuck-loop and orphaned worktree after milestone completion (#3065)
- **mcp**: handle server names with spaces in mcp_discover (#3037)
- **gsd**: detect markdown body verdicts and guard plan-milestone against completed slices (#2960) (#3035)
- **error-classifier**: replace STREAM_RE whack-a-mole with catch-all V8 JSON.parse pattern
- type _borderColorKey as 'dim' | 'bashMode' to match ThemeColor
- **tui**: comprehensive TUI review — layout, flow, rendering, and state fixes
- **gsd**: harden codebase-map — bug fixes, UX polish, and expanded tests

### Changed
- **state**: centralize pipeline logging through workflow logger (#3282)
- **gitignore**: exclude src/ build artifacts, scratch files, and .plans/
- **complexity**: reclassify planning phases from standard to heavy tier

## [2.58.0] - 2026-03-28

### Added
- Added 6 discord.js shard/error/warn event listeners for reconnect…

### Fixed
- **auto**: guard startAuto() against concurrent invocation (#2923)
- **auto-dispatch**: widen operational verification gate regex (fixes #2866) (#2898)
- **parallel**: three bugs preventing reliable parallel worker execution (#2801)
- **web**: fall back to project totals when dashboard metrics are zero (#2847)
- **gsd**: parse raw YAML under preference headings (#2794)
- **gsd**: persist verification classes in milestone validation (#2820)
- **gsd**: guard reconcileWorktreeDb against same-file ATTACH corruption (#2825)
- **web**: skip shutdown in daemon mode so server survives tab close (#2842)
- **headless**: skip execution_complete for multi-turn commands (auto/next)
- Fixed 3 bugs (launchd JSON parsing, login race condition, interact…

## [2.57.0] - 2026-03-28

### Added
- Extended DaemonConfig with control_channel_id and orchestrator se…
- Created pure-function event formatters (10 functions) mapping RPC…
- **models**: add GLM-5.1 to Z.AI provider in custom models
- Added discord.js v14, DiscordBot class with auth guard and lifecy…
- Created packages/daemon workspace package with DaemonConfig/LogLe…
- headless text mode shows tool calls + skip UAT pause in headless
- Wire --resume flag to resolve session IDs via prefix matching and…
- Migrated headless orchestrator to use execution_complete events,…

### Fixed
- **headless**: match "completed" status from RPC v2 in exit code mapper
- show external drives in directory browser on Linux
- Regenerate package-lock.json after merge
- **gsd**: resume cold auto bootstrap from db
- **gsd**: preserve first auto unit model after session reset
- Accept flags after positional command in headless arg parser
- **gsd**: discover project subagents in .gsd
- **model-routing**: use honest unitTypes for discuss dispatches and map all auto-dispatch phases
- revert jsonl.ts to inline implementation — @gsd-build/rpc-client not available at source-level test time in CI

### Changed
- auto-commit after complete-milestone

## [2.56.0] - 2026-03-27

### Added
- **parallel**: /gsd parallel watch — native TUI overlay for worker monitoring (#2806)

### Fixed
- **ci**: copy web/components to dist-test for xterm-theme test (#2891)
- **gsd**: prefer PREFERENCES.md in worktrees (#2796)
- **gsd**: resume auto-mode after transient provider pause (#2822)
- **parallel**: resolve session lock contention and 3 related parallel-mode bugs (#2184) (#2800)
- **web**: improve light theme terminal contrast (#2819)
- **gsd**: preserve auto start model through discuss (#2837)

### Changed
- **test**: compile unit tests with esbuild, reclassify integration tests, fix node_modules symlink (#2809)

## [2.55.0] - 2026-03-27

### Added
- colorized headless verbose output with thinking, phases, cost, and durations (#2886)
- headless text mode observability + skip UAT pause (#2867)

### Fixed
- **cli**: let gsd update bypass version mismatch gate (#2845)
- **contracts**: add isWorkspaceEvent guard + close routeLiveInteractionEvent exhaustiveness gap (#2878)
- **gsd**: use project root for prior-slice dispatch guard (#2863)
- **gsd**: include queue context in milestone planning prompts (#2846)
- detect monorepo roots in project discovery to prevent workspace fragmentation (#2849)
- **bg-shell**: recover from deleted cwd in timers (#2850)
- **gsd**: enable dynamic routing without models section (#2851)
- **interactive**: fully remove providers from /providers (#2852)

## [2.54.0] - 2026-03-27

### Added
- Headless Integration Hardening & Release (M002) (#2811)
- **parallel**: add real-time TUI monitor dashboard with self-healing (#2799)

## [2.53.0] - 2026-03-27

### Added
- **vscode**: activity feed, workflow controls, session forking, enhanced code lens [2/3] (#2656)
- **gsd**: enable safety mechanisms by default (snapshots, pre-merge checks) (#2678)

### Fixed
- hydrate collected secrets for current session (#2788)
- resolve stash pop conflicts and stop swallowing merge errors (#2780)
- treat any extracted verdict as terminal in isValidationTerminal (#2774)
- use localStorage for auth token to enable multi-tab usage (#2785)
- guard activeMilestone.id access in discuss and headless paths (#2776)
- clean up zombie parallel workers stuck in error state (#2782)
- relax milestone validation gate to accept prose evidence (#2779)
- write milestone reports to project root instead of worktree (#2778)
- auto-resolve build artifact conflicts in milestone merge (#2777)
- let rate-limit errors attempt model fallback before pausing (#2775)
- prevent gsd next from self-killing via stale crash lock (#2784)
- add shell flag for Windows spawn in VSCode extension (#2781)

### Changed
- **gsd**: extract duplicated status guards and validation helpers (#2767)

## [2.52.0] - 2026-03-27

### Added
- **vscode**: status bar, file decorations, bash terminal, session tree, conversation history, code lens [1/2] (#2651)
- **web**: Dark mode contrast — raise token floor and flatten opacity tier system (#2734)
- Wire --bare mode across headless → pi-coding-agent → resource-loa…
- Added runId generation on prompt/steer/follow_up commands, event…
- Added RPC protocol v2 types, init handshake with version detectio…

### Fixed
- auto-mode stops after provider errors (#2762) (#2764)
- add missing runtime stage name to Dockerfile (#2765)
- make transaction() re-entrant and add slice_dependencies to initSchema
- remove preferences.md from ROOT_STATE_FILES to prevent back-sync overwrite
- wire tool handlers through DB port layer, remove _getAdapter from all tools
- **gsd**: move state machine guards inside transaction in 5 tool handlers (#2752)
- reconcile disk milestones into empty DB before deriveStateFromDb guard (#2686)
- **gsd**: seed preferences.md into auto-mode worktrees (#2693)
- **claude-import**: discover marketplace plugins nested inside container directories (#2718)
- exempt interactive tools from idle watchdog stall detection (#2676)
- guard allSlicesDone against vacuous truth on empty slice array (#2679)
- block complete-milestone dispatch when VALIDATION is needs-remediation (#2682)
- **gsd**: sync milestone DB status in parkMilestone and unparkMilestone (#2696)
- **web**: auth token gate — synthetic 401 on missing token, unauthenticated boot state, and recovery screen (#2740)
- **remote-questions**: empty-key entry in auth.json shadows valid Discord bot token (#2737)
- idle watchdog stalled-tool detection overridden by filesystem activity (#2697)
- surface exhausted Claude SDK streams as errors (#2719)
- **docker**: overhaul fragile setup, adopt proven container patterns (#2716)
- **gsd**: write DB before disk in validate-milestone to match engine pattern (#2742)
- **gsd**: extract and honor milestone argument in /gsd auto and /gsd next (#2729)
- **windows**: prevent EINVAL by disabling detached process groups on Win32 (#2744)
- **gsd**: delete orphaned verification_evidence rows on complete-task rollback (#2746)
- **gsd**: wire setLogBasePath into engine init to resurrect audit log (#2745)
- Remove premature pendingTools.delete in webSearchResult handler (#2743)
- **gsd**: remove redundant assertions that fail TS2367 typecheck
- include preferences.md in worktree sync and initial seed

### Changed
- **pi-ai**: replace model-ID pattern matching with capability metadata (#2548)
- **gsd-db**: comprehensive SQLite audit fixes — indexes, caching, safety, reconciliation
- rename preferences.md to PREFERENCES.md for consistency (#2700) (#2738)
- **gsd**: unify three overlapping error classifiers into single classify→decide→act pipeline

## [2.51.0] - 2026-03-26

### Added
- add /terminal slash command for direct shell execution (#2349)
- **auto**: check verification class compliance before milestone completion (#2623)
- **validate**: extract followUps and knownLimitations in parseSummary (#2622)
- managed RTK integration with opt-in preference and web UI toggle (#2620)
- **validate**: inject verification classes into milestone validation prompt (#2621)
- **skills**: add 19 wshobson/agents packs with 40 curated skills
- **skills**: add 11 new skill packs covering major frameworks and languages
- **skills**: add SQLite/SQL detection, SQL optimization pack, and Redis pack
- **skills**: add Prisma and Supabase/Postgres database packs
- **skills**: add cloud platform packs (Firebase, Azure, AWS) and improve detection
- **skills**: curate catalog — add top ecosystem skills, drop low-quality bundled ones
- **skills**: parse SDKROOT from pbxproj for platform-aware iOS skill matching
- **skills**: use ~/.agents/skills/ as primary skills directory with curated catalog

### Fixed
- improve light theme warning contrast (#2674)
- honor explicit model config when model is not in known tier map (#2643)
- exclude lastReasoning from retry diagnostic to prevent hallucination loops (#2663)
- persist rewrite-docs attempt counter to disk for session restart survival (#2671)
- add non-null assertions for parseUnitId optional fields in tests
- update triage-dispatch static analysis tests for enqueueSidecar helper
- **notifications**: prefer terminal-notifier over osascript on macOS (#2633)
- classify stream-truncation JSON parse errors as transient (#2636)
- call ensureDbOpen() before slice queries in /gsd discuss (#2640)
- **prompts**: use --body-file for forensics issue creation (#2641)
- isLockProcessAlive should return true for own PID (#2642)
- check ASSESSMENT file for UAT verdict in checkNeedsRunUat (#2646)
- use pauseAuto instead of stopAuto for warning-level dispatch stops (#2666)
- signal malformed tool arguments in toolcall_end event (#2647)
- prevent double mergeAndExit on milestone completion (#2648)
- respect queue-order.json in DB-backed state derivation (#2649)
- **vscode**: support Remote SSH by adding extensionKind and error handler (#2650)
- update DB task status in writeBlockerPlaceholder for execute-task (#2657)
- normalize path separators in matchesProjectFileMarker for Windows
- **tests**: remove obsolete doctor filesystem test
- **tests**: update doctor issue code to db_done_task_no_summary
- restore PR files lost during merge conflict resolution
- **skills**: address QA round 3
- **skills**: address QA round 2
- **skills**: address QA round 1
- **skills**: prioritize ecosystem dir and skip legacy after migration
- **skills**: address QA round 23
- **skills**: address QA round 22
- **skills**: address QA round 21
- **skills**: address QA round 20
- **skills**: address QA round 19
- **skills**: address QA round 18
- **skills**: address QA round 17
- **skills**: address QA round 16
- **skills**: address QA round 15
- **skills**: address QA round 14
- **skills**: address QA round 13
- **skills**: address QA round 12
- **skills**: address QA round 11
- **skills**: address QA round 10
- **skills**: address QA round 8
- **skills**: detect FastAPI via dependency scanning
- **skills**: address QA round 6
- **skills**: address QA round 5
- **skills**: address QA round 4
- **skills**: address QA round 3
- **skills**: address QA round 2
- **skills**: defer greenfield skill selection to post-design phase
- **skills**: add migration from ~/.gsd/agent/skills/ to ~/.agents/skills/
- **gsd extension**: detect initialized projects in health widget
- **gsd extension**: detect initialized projects in health widget

### Changed
- consolidate docs, remove stale artifacts, and repo hygiene (#2665)
- extract runSafely helper for try-catch-debug-continue pattern (#2611)

## [2.50.0] - 2026-03-26

### Added
- **gsd**: wire structured error propagation through UnitResult
- add parallel quality gate evaluation with evaluating-gates phase
- add 8-question quality gates to planning and completion templates

### Fixed
- reconcile stale task status in filesystem-based state derivation (#2514)
- merge duplicate extractUatType imports in auto-dispatch
- use Record<string, any> for hasNonEmptyFields to accept typed DB rows
- **tests**: replace undefined assertTrue/assertEq with assert.ok/assert.equal
- **tests**: replace undefined assertTrue/assertEq with assert.ok/deepStrictEqual
- **gsd**: handle session_switch event so /resume restores GSD state (#2587)
- use GitHub Issue Types via GraphQL instead of classification labels
- **headless**: disable overall timeout for auto-mode, fix lock-guard auto-select (#2586)
- **auto**: align UAT artifact suffix with gsd_slice_complete output (#2592)
- **retry-handler**: stop treating 5xx server errors as credential-level failures
- **test**: replace stale completedUnits with sessionFile in session-lock test
- **session-lock**: retry lock file reads before declaring compromise
- **gsd**: prevent ensureGsdSymlink from creating subdirectory .gsd when git-root .gsd exists
- **auto**: add EAGAIN to INFRA_ERROR_CODES to stop budget-burning retries
- **search**: enforce hard search budget and survive context compaction
- **remote-questions**: use static ESM import for AuthStorage hydration
- add SAFE_SKILL_NAME guard to reject prompt-injection via crafted skill names
- **gsd**: use explicit parameter syntax in skill activation prompts
- guard writeIntegrationBranch against workflow-template branches
- preserve doctor missing-dir checks for active legacy slices
- **gsd**: downgrade isolation mode when worktree creation fails
- **gsd**: skip loading files for completed milestones in queue context builder
- resolve race conditions in blob-store, discovery-cache, and agent-loop
- **ai**: resolve WebSocket listener leaks and bound session cache
- **rpc**: resolve double-set race, missing error ID, and stream handler
- **pi-coding-agent**: prevent crash when login is cancelled
- **doctor**: compare lockfile mtime against install marker, not directory mtime (#1974)
- **doctor**: chdir out of orphaned worktree before removal (#1946)
- **roadmap**: recognize '## Slice Roadmap' header in extractSlicesSection
- prevent worktree sync from overwriting state and forward-sync completed-units.json
- **web**: lazily compute default package root to avoid Windows standalone crash

### Changed
- adopt parseUnitId utility across all auto-* modules
- flatten syncMilestoneDir nesting with shared helper
- extract merge-state cleanup helper in reconcileMergeState
- extract planning-state validation helpers in detectRogueFileWrites
- split doctor-checks into focused modules
- merge auto-worktree-sync into auto-worktree
- deduplicate artifact path functions into single module
- remove dead selfHealRuntimeRecords function from auto-recovery
- decouple session-forensics from auto-worktree
- remove dead worktree code and unused methods
- consolidate branch name patterns into single module
- deduplicate session-lock compromise handler and state assignment

## [2.49.0] - 2026-03-25

### Added
- add --yolo flag to /gsd auto for non-interactive project init

### Fixed
- use full git log in merge tests to match trailer-based milestone IDs
- update parallel-merge test assertion for new trailer format
- clarify regex alternation in test assertion
- verdict gate accepts PARTIAL for mixed/human-experience/live-runtime UATs

### Changed
- move GSD metadata from commit subject scopes to git trailers

## [2.48.0] - 2026-03-25

### Added
- **discuss**: allow /gsd discuss to target queued milestones
- enhance /gsd forensics with journal and activity log awareness

### Fixed
- make journal scanning intelligent — limit parsed files, line-count older ones
- **model-registry**: scope custom provider stream handlers to prevent clobbering built-in API handlers
- **forensics**: filter benign bash exit-code-1 and user skips from error traces
- **gsd**: clear stale milestone ID reservations at session start
- render tool calls above text response for external providers
- **auto**: skip CONTEXT-DRAFT warning for completed/parked milestones

### Changed
- address review - extract RAPID_ITERATION_THRESHOLD_MS, simplify data access

### Removed
- remove insertChildBefore usage in chat-controller

## [2.47.0] - 2026-03-25

### Added
- **agent-core**: add externalToolExecution mode for external providers
- **provider**: add Claude Code CLI provider extension

### Fixed
- **claude-code-cli**: render tool calls above text response
- **ci**: update FILE-SYSTEM-MAP.md path after docs→docs-internal move
- isInheritedRepo false negative when parent has stale .gsd; defense-in-depth local .git check in bootstrap
- **claude-code-cli**: resolve SDK executable path and update model IDs
- make planning doctrine demoable definition audience-appropriate
- **prompts**: migrate remaining 4 prompts to use DB-backed tool API instead of direct write
- make workflow event hash platform-deterministic
- reconcile stale task DB status from disk artifacts (#2514)

## [2.46.1] - 2026-03-25

### Fixed
- **ci**: prevent windows-portability from blocking pipeline
- **ci**: prevent pipeline race condition on release push
- **gsd**: create empty DB for fresh projects with empty .gsd/ (#2510)
- **remote-questions**: hydrate remote channel tokens from auth.json on startup

### Changed
- trigger CI to pick up pipeline race condition fix
- trigger pipeline with race condition fix

## [2.46.0] - 2026-03-25

### Added
- **gsd**: single-writer engine v3 — state machine guards, actor identity, reversibility
- **gsd**: single-writer state engine v2 — discipline layer on DB architecture
- **gsd**: add workflow-logger and wire into engine, tool, manifest, reconcile paths (#2494)

### Fixed
- **gsd**: align prompts with single-writer tool API
- **gsd**: integration-proof — check DB state not roadmap projection after reset
- **gsd**: block milestone completion when verification fails (#2500)
- **ci**: add typecheck:extensions to pretest to prevent silent type drift
- **gsd**: relax integration-proof cross-validation for table-format roadmap
- **gsd**: update integration-proof tests for table-format roadmap projections
- **gsd**: update test assertions for schema v11, prompt changes, and removed completedUnits
- **gsd**: update test files for removed completedUnits, writeLock signature, and type changes
- **gsd**: remove stale completedUnits refs, fix writeLock callers, add missing imports
- **gsd**: harden single-writer engine — close TOCTOU, intercept bypasses, status inconsistencies
- **write-intercept**: close bare-relative-path bypass in STATE.md regex
- **voice**: fix misleading portaudio error on PEP 668 Linux systems (#2403) (#2407)
- **core**: address PR review feedback for non-apikey provider support (#2452)
- **ci**: retry npm install in pipeline to handle registry propagation delay (#2462)
- **gsd**: change default isolation mode from worktree to none (#2481)
- **loader**: add startup checks for Node version and git availability (#2463)
- **gsd**: add worktree lifecycle events to journal (#2486)

## [2.45.0] - 2026-03-25

### Added
- **web**: make web UI mobile responsive (#2354)
- **gsd**: add `/gsd rethink` command for conversational project reorganization (#2459)
- **gsd**: add renderCall/renderResult previews to DB tools (#2273)
- add timestamps on user and assistant messages (#2368)
- **gsd**: add `/gsd mcp` command for MCP server status and connectivity (#2362)
- complete offline mode support (#2429)
- **system-context**: inject global ~/.gsd/agent/KNOWLEDGE.md into system prompt (#2331)

### Fixed
- **gsd**: handle retentionDays=0 on Windows + run windows-portability on PRs (#2460)
- use Array.from instead of Buffer.from for native processStreamChunk state (#2348)
- **gsd**: isInheritedRepo conflates ~/.gsd with project .gsd when git root is $HOME (#2398)
- reconcile disk milestones missing from DB in deriveStateFromDb (#2416) (#2422)
- **auto**: reset recoveryAttempts on unit re-dispatch (#2322) (#2424)
- detect and preserve submodule state during worktree teardown (#2337) (#2425)
- **auto-start**: handle survivor branch recovery in phase=complete (#2358) (#2427)
- **gsd**: widen test search window for CRLF portability on Windows (#2458)
- **gsd**: preserve rich task plans on DB roundtrip (#2450) (#2453)
- merge worktree back to main when stopAuto is called after milestone completion (#2317) (#2430)
- **gsd**: skip doctor directory checks for pending slices (#2446)
- **gsd**: migrate completion/validation prompts to DB-backed tools (#2449)
- **gsd**: prevent saveArtifactToDb from overwriting larger files with truncated content (#2442) (#2447)
- stop auto loop on real code merge conflicts (#2330) (#2428)
- classify terminated/connection errors as transient in provider error handler (#2309) (#2432)
- archive completed-units.json on milestone transition and sync metrics.json (#2313) (#2431)
- supervision timeouts now respect task est: annotations (#2243) (#2434)
- auto_pr: true now actually creates PRs — fix 3 interacting bugs (#2302) (#2433)
- **gsd**: insert DB row when generating milestone ID (#2416)
- **gsd**: reconcile disk-only milestones into DB in deriveStateFromDb (#2416)
- **preferences**: deduplicate unrecognized format warning on repeated loads (#2375)
- gate auto-mode bootstrap on SQLite availability (#2419) (#2421)
- block /gsd quick when auto-mode is active (#2420)
- **ci**: add Rust target for all platforms, not just cross-compilation
- **ci**: restore Rust target triple and separate cross-compilation setup
- **ci**: separate cross-compilation target from toolchain install

### Changed
- migrate D-G test files from createTestContext to node:test (#2418)
- **test**: replace try/finally with beforeEach/afterEach in packages tests (#2390)
- **test**: migrate gsd/tests s-z from custom harness to node:test (#2397)
- **test**: migrate gsd/tests o-r from custom harness to node:test (#2401)
- **test**: migrate gsd/tests i-n from custom harness to node:test (#2399)
- **test**: migrate gsd/tests a-c from custom harness to node:test (#2400)
- **test**: replace try/finally with t.after() in gsd/tests (e-i) (#2396)
- **test**: replace try/finally with t.after() in gsd/tests (a-d) (#2395)
- **test**: replace try/finally with t.after() in src/tests (o-z) (#2392)
- **test**: replace try/finally with t.after() in src/tests (a-n) (#2394)

## [2.44.0] - 2026-03-24

### Added
- **core**: support for 'non-api-key' provider extensions like Claude Code CLI (#2382)
- **docker**: add official Docker sandbox template for isolated GSD auto mode (#2360)
- **gsd**: show per-prompt token cost in footer behind show_token_cost preference (#2357)
- **web**: add "Change project root" button to web UI (#2355)
- **gsd**: Tool-driven write-side state transitions — replace markdown mutation with atomic SQLite tool calls (#2141)
- **S06/T02**: Strip all 16 lazy createRequire fallback paths from migr…
- **S05/T04**: Migrate remaining 6 callers (auto-prompts, auto-recovery…
- **S05/T03**: Migrate 7 warm/cold callers (doctor, doctor-checks, visu…
- **S05/T02**: Extend migrateHierarchyToDb to populate v8 planning colu…
- **S05/T01**: Schema v10 adds replan_triggered_at column; deriveStateF…
- **S04/T03**: Migrate auto-dispatch.ts (3 rules), auto-verification.ts…
- **S04/T02**: Migrate dispatch-guard.ts to DB queries with isDbAvailab…
- **S01/T03**: Migrate planning prompts to DB-backed tool guidance and…
- **S01/T01**: Partially advanced schema v8 groundwork and documented t…
- **gsd**: tool-driven write-side state transitions (M001)

### Fixed
- post-migration cleanup — pragmas, rollbacks, tool gaps, stale code (#2410)
- **test**: normalize CRLF in auto-stash-merge assertion for Windows
- **test**: swallow EPERM on Windows temp dir cleanup in auto-stash-merge test
- **gsd**: add file-based fallbacks for DB-dependent code paths and fix CI test failures
- **gsd**: remove stale observabilityIssues reference in journal-integration test
- **extensions**: detect TypeScript syntax in .js extension files and suggest renaming to .ts (#2386)
- **gsd**: prevent planning data loss from destructive upsert and post-unit re-import (#2370)
- **gsd**: use correct notify severity type ("warning" not "warn")
- **web**: resolve compiled .js modules for all subprocess calls under node_modules (#2320)
- **test**: increase perf assertion threshold to prevent CI flake (#2327)
- add missing SQLite WAL sidecars and journal to runtime exclusion lists (#2299)
- **gsd**: remove stale observability validator + fix greenfield worktree check
- **memory**: fix memory and resource leaks across TUI, LSP, DB, and automation (#2314)
- **gsd**: preserve freeform DECISIONS.md content on decision save (#2319)
- **pi-ai**: restore alibaba-coding-plan provider via models.custom.ts (#2350)
- **doctor**: skip false env_dependencies error in auto-worktrees (#2318)
- **gsd**: auto-stash dirty files before squash merge and surface dirty filenames in error (#2298)
- **gsd**: keep params as any in db-tools executors (CI tsconfig is stricter)
- **gsd**: replace any types in db-tools executor signatures
- **gsd**: resolve 4 TS compilation errors from parser migration
- **gsd**: wrap plan-task DB writes in transaction + untrack .gsd/ artifacts
- **S04/T04**: Add planning-crossval tests proving DB↔rendered↔parsed pa…
- **S04/T01**: Add schema v9 migration with sequence column on slices/ta…
- remove .gsd/ milestone artifacts from git index
- **tests**: update remediation step assertions and crossval fixture
- **gsd**: address all 7 review findings from PR #2141
- **tests**: remove invalid `seq` property from insertMilestone calls

### Changed
- **contrib**: add CODEOWNERS and team workflow docs (#2286)
- **M001**: auto-commit after complete-milestone
- **M001**: auto-commit after validate-milestone
- **M001/S06**: auto-commit after complete-slice
- **M001/S06**: auto-commit after plan-slice
- **M001/S06**: auto-commit after research-slice
- **M001/S05**: auto-commit after complete-slice
- **M001/S05**: auto-commit after plan-slice
- **M001/S05**: auto-commit after research-slice
- **M001/S04**: auto-commit after complete-slice
- **M001/S04**: auto-commit after research-slice
- **M001/S03**: auto-commit after complete-slice
- **M001/S03**: auto-commit after plan-slice
- **M001/S03**: auto-commit after research-slice
- **M001/S02**: auto-commit after complete-slice
- **M001/S02**: auto-commit after plan-slice
- **M001/S02**: auto-commit after research-slice
- **M001/S01**: auto-commit after complete-slice

## [2.43.0] - 2026-03-23

### Added
- **forensics**: opt-in duplicate detection before issue creation (#2105)

### Fixed
- prevent banner from printing twice on first run (#2251)
- **test**: Windows CI — use double quotes in git commit message (#2252)
- **async-jobs**: suppress duplicate follow-up for awaited job results (#2248) (#2250)
- **gsd**: remove force-staging of .gsd/milestones/ through symlinks (#2247) (#2249)
- **gsd**: remove over-broad skill activation heuristic (#2239) (#2244)
- **auth**: fall through to env/fallback when OAuth credential has no registered provider (#2097)
- **lsp**: bound message buffer and clean up stale client state (#2171)
- clean up macOS numbered .gsd collision variants (#2205) (#2210)
- **search**: keep duplicate-search loop guard armed (#2117)
- clean up extension error listener on session dispose (#2165)
- **web**: resolve 4 pre-existing onboarding contract test failures (#2209)
- async bash job timeout hangs indefinitely instead of erroring out (#2214)
- **gsd**: apply fast service tier outside auto-mode (#2126)
- **interactive**: clean up leaked SIGINT and extension selector listeners (#2172)
- **ci**: standardize GitHub Actions and Node.js versions (#2169)
- **native**: resolve memory leaks in glob, ttsr, and image overflow (#2170)
- extension resource management — prune stale dirs, fix isBuiltIn, gate skills on Skill tool, suppress search warnings (#2235)
- batch isolated fixes — error messages, preferences, web auth, MCP vars, detection, gitignore (#2232)
- document iTerm2 Ctrl+Alt+G keybinding conflict and add helpful hint (#2231)
- **footer**: display active inference model during execution (#1982)
- **web**: kill stale server process before launch to prevent EADDRINUSE (#1934) (#2034)
- **git**: force LC_ALL=C in GIT_NO_PROMPT_ENV to support non-English locales (#2035)
- **forensics**: force gh CLI for issue creation to prevent misrouting (#2067) (#2094)
- force-stage .gsd/milestones/ artifacts when .gsd is a symlink (#2104) (#2112)
- **pi-ai**: correct Copilot context window and output token limits (#2118)

### Changed
- startup optimizations — pre-compiled extensions, compile cache, batch discovery (#2125)

## [2.42.0] - 2026-03-22

### Added
- **gsd**: declarative workflow engine — YAML-defined workflows through the auto-loop (#2024)
- **gsd**: unified rule registry, event journal, journal query tool, and tool naming convention (#1928)
- **ci**: PR risk checker — classify changed files by system and surface risk level (#1930)
- ADR attribution — distinguish human vs agent vs collaborative decisions (#1830)
- add /gsd fast command and gate service tier icon to supported models (#1848) (#1862)
- add --host, --port, --allowed-origins flags for web mode (#1847) (#1873)

### Fixed
- **tests**: wrap rmSync cleanup in try/catch for Windows EPERM
- **tests**: add maxRetries to rmSync cleanup for Windows EPERM compatibility
- recursive key sorting in tool-call loop guard hash function (#1962)
- use path.sep for cross-platform path traversal guards and test assertions
- **tests**: use cross-platform path split in run-manager timestamp test
- prevent SIGTSTP crash on Windows (#2018)
- add missing codeFilesChanged to journal integration test mock
- **repo-identity**: use native realpath on Windows to resolve 8.3 short paths (#1960)
- **doctor**: gate roadmap checkbox on summary existing on disk, not issue detection (#1915)
- warn when milestone merge contains only metadata and no code (#1906) (#1927)
- **worktree**: resolve 8.3 short paths and use shell mode for .bat hooks on Windows (#1956)
- **web**: persist auth token in sessionStorage to survive page refreshes (#1877)
- clean up SQUASH_MSG after squash-merge and guard worktree teardown against uncommitted changes (#1868)
- populate RecoveryContext in hook unit supervision to prevent crash on stalled tool recovery (#1867)
- resolve worktree path from git registry when .gsd/ symlink is shadowed (#1866)
- resolve Node v24 web boot failure — ERR_UNSUPPORTED_NODE_MODULES_TYPE_STRIPPING (#1864)
- **auto**: broaden worktree health check to all ecosystems (#1860)
- **doctor**: cascade slice uncheck when task_done_missing_summary unchecks tasks (#1850) (#1858)
- defend exit path against ESM module cache mismatch (#1854)
- escape parentheses in paths before bash shell-out, fix __extensionDir fallback (#1872)
- use PowerShell Start-Process for Windows browser launch, prevent URL wrapping (#1870)
- clear stale unit state and restore CWD when step-wizard exits auto-loop (#1869)
- prevent cross-project state leak in brand-new directories (#1639) (#1861)
- reconcile worktree HEAD with milestone branch ref before squash merge (#1846) (#1859)
- normalize Windows backslash paths in bash command strings (#1436) (#1863)
- parsePlan and verifyExpectedArtifact recognize heading-style task entries (#1691) (#1857)
- sync all milestone dirs regardless of naming convention (#1547) (#1845)

## [2.41.0] - 2026-03-21

### Added
- **doctor**: worktree lifecycle checks, cleanup consolidation, enhanced /worktree list (#1814)
- **web**: browser-based web interface (#1717)
- **ci**: skip build/test for docs-only PRs and add prompt injection scan (#1699)
- **docs**: add Custom Models guide and update related documentation (#1670)
- surface doctor issue details in progress score widget and health views (#1667)
- **cleanup**: add ~/.gsd/projects/ orphan detection and pruning (#1686)

### Fixed
- skip web build on Windows — Next.js webpack hits EPERM on system dirs
- include web build in main build command
- fall through to prose slice parser when checkbox parser yields empty under ## Slices (#1744)
- **auto**: verify merge anchored before worktree teardown (#1829)
- **auto**: reject execute-task with zero tool calls as hallucinated (#1838)
- also convert --import resolver path to file URL for Windows
- use pathToFileURL for Windows-safe ESM import in verification-gate test
- **gsd**: read depends_on from CONTEXT-DRAFT.md when CONTEXT.md is absent (#1743)
- **roadmap**: detect ✓ completion marker in prose slice headers (#1816)
- **auto**: reverse-sync root-level .gsd files on worktree teardown (#1831)
- **tui**: prevent freeze when using @ file finder (#1832)
- prevent silent data loss when milestone merge fails due to dirty working tree (#1752)
- **verification**: avoid DEP0190 by passing command to shell explicitly (#1827)
- **state**: treat zero-slice roadmap as pre-planning instead of blocked (#1826)
- **hooks**: process depth verification in queue mode (#1823)
- **auto**: register SIGHUP/SIGINT handlers to clean lock files on crash (#1821)
- auto-dispatch discussion instead of hard-stopping on needs-discussion phase (#1820)
- **doctor**: fix roadmap checkbox and UAT stub immediately instead of deferring (#1819)
- **auto**: resolve pending unitPromise in stopAuto to prevent hang (#1818)
- **git**: handle unborn branch in nativeBranchExists to prevent dispatch deadlock (#1815)
- **doctor**: prevent cleanup from deleting user work files (#1825)
- use realpathSync.native on Windows to resolve 8.3 short paths
- detect and skip ghost milestone directories in deriveState() (#1817)
- create milestone directory when triage defers to a not-yet-existing milestone (#1813)
- add @gsd/pi-tui to test module resolver in dist-redirect (#1811)
- surface unmapped active requirements when all milestones complete (#1805)
- normalize paths in tests to handle Windows 8.3 short-path forms (#1804)
- share milestone ID reservation between preview and tool (#1569) (#1802)
- **tui,gsd**: tool-call loop guard + TUI stack overflow prevention (#1801)
- validate paused-session milestone before restoring it (#1664) (#1800)
- detect REPLAN-TRIGGER.md in deriveState for triage-initiated replans (#1798)
- dispatch uat targets last completed slice instead of activeSlice (#1693) (#1796)
- read depends_on from CONTEXT-DRAFT.md when CONTEXT.md absent (#1795)
- **worktree**: sync root-level files and all milestone dirs on worktree teardown (#1794)
- dashboard highlights UAT target slice instead of advanced activeSlice (#1793)
- dispatch guard skips completed milestones with SUMMARY file (#1791)
- ensureDbOpen creates DB + migrates Markdown in interactive sessions (#1790)
- add require condition to pi-tui exports for CJS resolution
- update integration test to match dependency-aware dispatch guard wording
- use createRequire instead of bare require for lazy pi-tui import
- update doctor-git test to match PR #1633 behavior change
- increase resolveProjectRootFromGitFile walk-up limit from 10 to 30
- include ensure-workspace-builds.cjs in npm package files
- resolve extension typecheck errors in test files
- resolve CI build errors from Wave 4+5 merges
- return retry from postUnitPreVerification when artifact verification fails (#1571) (#1782)
- hook model field uses model-router resolution instead of Claude-only registry (#1720) (#1781)
- stop auto-mode immediately on infrastructure errors (ENOSPC, ENOMEM, etc.) (#1780)
- add missing milestones/ segment in resolveHookArtifactPath (#1779)
- break needs-discussion infinite loop when survivor branch exists (#1726) (#1778)
- tear down browser sessions at unit boundaries and in stopAuto (#1733) (#1777)
- rebuild STATE.md and reset completed-units on milestone transition (#1576) (#1775)
- resolve pending unit promise on all exit paths to prevent orphaned auto-loop (#1774)
- closeout unit on pause and heal runtime records on resume (#1625) (#1773)
- call selfHealRuntimeRecords before autoLoop to clear orphaned dispatched records (#1772)
- dispatch guard uses dependency declarations instead of positional ordering (#1638) (#1770)
- add configurable timeout to await_job to prevent indefinite session blocking (#1769)
- **parallel**: restore orchestrator state from session files and add worker stderr logging (#1748)
- prevent getLoadedSkills crash and auto-build workspace packages (#1767)
- session lock multi-path cleanup and false positive hardening (#1578) (#1765)
- robust node_modules symlink handling to prevent extension loading failures (#1762)
- lazy-load @gsd/pi-tui in shared/ui.ts to prevent /exit crash (#1761)
- validate worktree .git file and fix metrics toolCall casing (#1713) (#1754)
- verify implementation artifacts before milestone completion (#1703) (#1760)
- make task closeout crash-safe by unchecking orphaned checkboxes (#1650) (#1759)
- preserve milestone branch on merge-back during transitions (#1573) (#1758)
- write crash lock after newSession so it records correct session path (#1757)
- handle symlinked .gsd in git add pathspec exclusions (#1712) (#1756)
- guard worktree teardown on empty merge to prevent data loss (#1672) (#1755)
- resolve symlinks in doctor orphaned-worktree check (#1715) (#1753)
- silence spurious extension load error for non-extension libraries (#1709) (#1747)
- reset completion state when post_unit_hooks retry_on signal is consumed (#1746)
- route needs-discussion phase to showSmartEntry, preventing infinite /gsd loop (#1745)
- **roadmap**: parse table-format slices in roadmap files (#1741)
- extract milestone title from CONTEXT.md when ROADMAP is missing (#1729)
- **gsd**: harden auto-mode telemetry — metrics idempotency, elapsed guard, title sanitization (#1722)
- **gsd**: make saveJsonFile atomic via write-tmp-rename pattern (#1719)
- **gsd**: syncWorktreeStateBack recurses into tasks/ subdirectory (#1678) (#1718)
- prevent parallel worktree path resolution from escaping to home directory (#1677)
- add web search budget awareness to discuss and queue prompts (#1702)
- harden auto-mode against stale integration metadata and Windows file locks (#1633)
- **autocomplete**: repair /gsd skip, add widget/next completions, add discuss to hint (#1675)
- **search**: keep loop guard armed after firing to prevent infinite loop restart (#1671) (#1674)
- **worktree**: detect default branch instead of hardcoding "main" on milestone merge (#1668) (#1669)
- remove duplicate TUI header rendered on session_start (#1663)
- **worktree**: recurse into tasks/ when syncing slice artifacts back to project root (#1678) (#1681)

### Changed
- split shared/mod.ts into pure and TUI-dependent barrels (#1807)
- replace hardcoded /tmp paths with os.tmpdir()/homedir() (#1708)
- **ci**: reduce pipeline minutes with shallow clones, npm caching, and exponential backoff (#1700)
- split auto-loop.ts monolith into auto/ directory modules (#1682)

## [2.40.0] - 2026-03-20

### Added
- **pi**: add Skill tool resolution (#1661)
- health check phase 2 — real-time doctor issue visibility across widget, visualizer, and HTML reports (#1644)
- upgrade forensics prompt to full-access GSD debugger (#1660)

### Fixed
- prune stale env-utils.js from extensions root, preventing startup load error (#1655)
- **splash**: replace box corners with full-width bars for visual unity with auto-mode widget (#1654)
- add runtime paths to forensics prompt to prevent path hallucination (#1657)
- guard TUI render during session transitions to prevent freeze (#1658)
- default UAT type to artifact-driven to prevent unnecessary auto-mode pauses (#1651)
- cancel trailing async jobs on session switch to prevent wasted LLM turns (#1643)

### Changed
- decompose autoLoop into pipeline phases (#1615) (#1659)

## [2.39.0] - 2026-03-20

### Added
- **gsd**: activate matching skills in dispatched prompts (#1630)
- **gsd**: add .gsd/RUNTIME.md template for declared runtime context (#1626)
- **gsd**: create draft PR on milestone completion when git.auto_pr enabled (#1627)
- **gsd**: add browser-executable and runtime-executable UAT types (#1620)
- apply model preferences in guided flow for milestone planning (#1614)
- **gsd**: GitHub sync extension — auto-sync to Issues, PRs, Milestones (#1603)
- add GSD_PROJECT_ID env var to override project hash (#1600)
- add GSD_HOME env var to override global ~/.gsd directory (#1566)
- **gsd**: add 13 enhancements to /gsd doctor (#1583)
- feat(ui): minimal GSD welcome screen on startup (#1584)

### Fixed
- recover + prevent #1364 .gsd/ data-loss (v2.30.0–v2.38.0) (#1635)
- treat summary as terminal artifact even when roadmap slices are unchecked (#1632)
- **gsd**: close residual #1364 data-loss vectors on v2.36.0+ (#1637)
- auto-resolve npm subpath exports in extension loader (#1624)
- create node_modules symlink for dynamic import resolution in extensions (#1623)
- filter cross-milestone errors from health tracker escalation (#1621)
- move unit closeout to run immediately after completion (#1612)
- use pathspec exclusions in smartStage to prevent hanging on large repos (#1613)
- add auto-fix for premature slice completion deadlock in doctor (#1611)
- resolve ${VAR} env references in MCP client .mcp.json configs (#1609)
- return "dispatched" after doctor heal to prevent session race (#1580) (#1610)
- update Anthropic OAuth endpoints to platform.claude.com (#1608)
- lazy-open GSD database on first tool call in manual sessions (#1606)
- **gsd**: detect anthropic-vertex in provider doctor (#1598)
- **gsd**: tighten prompt automation contracts (#1556)
- **gsd**: harden auto-mode agent loop — session teardown, unit correlation, sidecar perf (#1592)
- break remaining shared/mod.js barrel imports in report generation chain (#1588)
- apply pi manifest opt-out to extension-discovery.ts (#1545)
- detect worktree paths resolved through .gsd symlinks (#1585)

### Changed
- **gsd**: unify sidecar mini-loop into main dispatch path (#1617)
- **auto-loop**: initial cleanup — hoist constant, cache prefs per iteration (#1616)
- **gsd**: add 30K char hard cap on prompt preamble (#1619)
- **gsd**: replace stuck counter with sliding-window detection (#1618)
- **auto-loop**: 5 code smell fixes (#1602)
- **gsd**: replace session-scoped promise bridge with per-unit one-shot (#1595)
- **gsd**: remove prompt compression subsystem (~4,100 lines) (#1597)
- **gsd**: crashproof stopAuto with independent try/catch per cleanup step (#1596)

## [2.38.0] - 2026-03-20

### Added
- **gsd**: ADR-004 — derived-graph reactive task execution (#1546)
- add anthropic-vertex provider for Claude on Vertex AI (#1533)

### Fixed
- **ci**: reduce GitHub Actions minutes ~60-70% (~10k → ~3-4k/month) (#1552)
- **gsd**: reactive batch verification + dependency-based carry-forward (#1549)
- **gsd**: enforce backtick file paths in task plan IO sections (#1548)

## [2.37.1] - 2026-03-20

### Fixed
- interactive guard menu for remote auto-mode sessions (#1507) (#1524)
- use pull_request_target so AI triage has secret access on PRs
- cmux library directory incorrectly loaded as extension (#1537)
- separate pi-tui-dependent layout utils to fix report generation (#1527)
- clarify session lock loss diagnostics (#1535)
- **#1526**: auto-mode worktree commits land on main instead of milestone branch (#1534)

## [2.37.0] - 2026-03-20

### Added
- **dashboard**: two-column layout with redesigned widget (#1530)
- integrate cmux with gsd runtime (#1532)

### Fixed
- add session-level search budget to prevent unbounded native web search (#1309) (#1529)

## [2.36.0] - 2026-03-20

### Added
- deprecate agent-instructions.md in favor of AGENTS.md / CLAUDE.md (#1492) (#1514)
- AI-powered issue and PR triage via Claude Haiku (#1510)

### Fixed
- preserve user messages during abort with origin-aware queue clearing (#1439) (#1521)
- remove broken SwiftUI skill and add CI reference check (#1476) (#1520)
- wire escalateTier into auto-loop retry path (#1505) (#1519)
- prevent bare /gsd from stealing session lock from running auto-mode (#1507) (#1517)
- wire dead token-profile defaults and add /gsd rate command (#1505) (#1516)
- prevent false-positive session lock loss during sleep/event loop stalls (#1512) (#1513)
- **gsd**: filter non-milestone directories from findMilestoneIds (#1494) (#1508)
- **gsd**: accept 'passed' as terminal validation verdict (#1429) (#1509)
- add missing imports breaking CI build (#1511)
- prevent ensureGitignore from adding .gsd when tracked in git (#1364) (#1367)
- check project root .env when secrets gate runs in worktree (#1387) (#1470)
- realign cwd before dispatch + clean stale merge state on failure (#1389) (#1400)
- create milestones/ directory in worktree when missing (#1374)
- inject network_idle warning into hook prompts (#1345) (#1401)
- verify symlink after migration + fix test failures (#1377) (#1404)
- validate CWD instead of project root when running from a GSD worktree (#1317) (#1504)
- **gsd**: detect initialized health widget projects (#1432)
- smarter .gsd root discovery — git-root anchor + walk-up replaces symlink hack (#1386)
- correct GSD-WORKFLOW.md fallback path and sync to agentDir (#1375)
- always include reasoning.encrypted_content for OpenAI reasoning models
- **gsd**: avoid EISDIR crash in file loader
- **gsd**: open existing database on inspect

## [2.35.0] - 2026-03-19

### Added
- **gsd**: add /gsd changelog command with LLM-summarized release notes (#1465)

### Fixed
- restore lsp single-server selector export
- **mcp**: preserve args for mcp_call tool invocations (#1354)
- accumulate session cost independently of message array (#1423)
- resolve CI failures — scope provider check, fix Windows path, correct severity
- close 5 doctor coverage gaps — providers, lock dir, integration branch, orphaned worktrees
- add PID self-check to guided-flow crash lock detection (#1398)
- **prefs**: close merge, validation, serialization, and docs gaps

### Changed
- deduplicate error emission and message patterns in agent-core (#1444)
- simplify settings manager with generic setter helpers (#1461)
- consolidate theme files and remove manual schema (#1478)
- extract overlay layout and compositing from TUI into separate module (#1482)
- extract slash command handlers from interactive-mode (#1485)
- remove dead code (unused exports) (#1486)
- extract retry handler and compaction orchestrator from agent-session
- deduplicate rendering patterns in markdown and keys
- consolidate shared code between OpenAI providers
- deduplicate RPC mode shared patterns
- extract shared tree rendering utilities
- consolidate OAuth callback server and helper utilities
- extract shared file lock utilities
- consolidate resource loader with generic update/dedupe methods
- consolidate model switching logic in agent-session
- extract shared helpers in compaction module
- deduplicate toPosixPath, ZERO_USAGE, and shortenPath utilities
- consolidate 9 emit methods in extension runner into shared invokeHandlers
- consolidate extension type guards and inline handler type aliases
- consolidate duplicate patterns in LSP module

## [2.34.0] - 2026-03-19

### Added
- auto-generate OpenRouter model registry from API + add missing models (#1407) (#1426)

### Fixed
- release stranded bootstrap locks and handle re-entrant reacquire (#1352)
- add JS fallbacks for wrapTextWithAnsi and visibleWidth when native addon unavailable (#1418) (#1428)
- emit agent_end after abort during tool execution (#1414) (#1417)
- auto-discard bootstrap crash locks and clean auto.lock on exit (#1397)
- harden quick-task branch lifecycle — disk recovery + integration branch guard (#1342)
- skip verification retry on spawn infra errors (ETIMEDOUT, ENOENT) (#1340)
- keep external GSD state stable in worktrees (#1334)
- stop excluding all .gsd/ from commits — only exclude runtime files (#1326) (#1328)
- handle ECOMPROMISED in uncaughtException guard and align retry onCompromised (#1322) (#1332)

## [2.33.1] - 2026-03-19

### Fixed
- clean up stale numbered lock files and harden signal/exit handling (#1315) (#1323)
- worktree sync and home-directory safety check (#1311, #1317) (#1322)

### Changed
- remove orphaned mcporter extension manifest (#1318)

## [2.33.0] - 2026-03-19

### Added
- add live regression test harness for post-build pipeline validation (#1316)

### Fixed
- align retry lock path with primary lock settings to prevent ECOMPROMISED (#1307)
- skip symlinks in makeTreeWritable to prevent EPERM on NixOS/nix-darwin (#1303)
- handle Windows EPERM on .gsd migration rename with copy+delete fallback (#1296)
- add actionable recovery guidance to crash info messages (#1295)
- resolve main repo root in worktrees for stable identity hash (#1294)
- merge quick-task branch back to original after completion (#1293)

### Changed
- extract tryMergeMilestone to eliminate 4 duplicate merge paths in auto.ts (#1314)
- dispatch loop hardening — defensive guards, regression tests, lock alignment (#1310)
- extract parseUnitId() to centralize unit ID parsing (#1282)
- extract getErrorMessage() helper to eliminate 65 inline duplicates (#1280)
- consolidate DB-fallback inline functions in auto-prompts (#1276)

## [2.32.0] - 2026-03-19

### Added
- always-on health widget and visualizer health tab expansion (#1286)
- environment health checks, progress score, and status integration (#1263)

### Fixed
- skip crash recovery when auto.lock was written by current process (#1289)
- load worktree-cli extension modules via jiti instead of static ESM imports (#1285)
- **gsd**: prevent concurrent dispatch during skip chains (#1272) (#1283)
- skip non-artifact UAT dispatch in auto-mode (#1277)

### Changed
- deduplicate knownUnitTypes and STATE_REBUILD_MIN_INTERVAL_MS constants (#1281)
- extract prompt builder helpers for inlined context and source file lists (#1279)
- extract createGitService() factory, remove debug logs (#1278)
- extract dispatchUnit helper, inline dead buildDocsCommitInstruction (#1275)
- unify unit-type switch statements into lookup map (#1273)

## [2.31.2] - 2026-03-18

### Fixed
- **gsd**: stop replaying completed run-uat units (#1270)

## [2.31.1] - 2026-03-18

### Fixed
- prevent false-positive 'Session lock lost' during auto-mode (#1257)


## [2.31.0] - 2026-03-18

### Added
- add aws-auth extension for automatic Bedrock credential refresh (#1253)
- add -w/--worktree CLI flag for isolated worktree sessions (#1247)

### Fixed
- remove stale git-commit assertion in worktree test after commit_docs removal
- remove commit_docs test that broke CI after type removal (#1258)
- replace blanket git clean .gsd/ with targeted runtime file removal (#1252)
- invalidate caches inside discuss loop to detect newly written slice context (#1249)
- robust prose slice header parsing — handle H1-H4, bold, dots, no-separator variants (#1248)
- clean up stranded .gsd.lock/ directory to prevent false lock conflicts (#1251)

### Changed
- remove dead commit_docs preference (incompatible with external .gsd/ state) (#1258)

## [2.30.0] - 2026-03-18

### Added
- add extension manifest + registry for user-managed enable/disable (#1238)
- add model health indicator to auto-mode progress widget (#1232)
- simplify auto pipeline — merge research into planning, mechanical completion (ADR-003) (#1235)
- add create-gsd-extension skill (#1229)
- add built-in skill authoring system (ADR-003) (#1228)
- **prefs**: two-step provider→model picker in preferences wizard (#1218)
- workflow templates — right-sized workflows for every task type (#1185)

### Fixed
- align react-best-practices skill name with directory name (#1234)
- gate slice progression on UAT verdict, not just file existence (#1241)
- invalidate caches before roadmap check in /gsd discuss (#1240)
- use shell: true for LSP spawn on Windows to resolve .cmd executables (#1233)
- increase headless new-milestone timeout and limit investigation scope (#1230)
- clean untracked .gsd/ files before squash-merge to prevent failure (#1239)
- graceful fallback when native addon is unavailable on unsupported platforms (#1225)
- replace ambiguous double-question in discussion reflection step (#1226)
- kill non-persistent bg processes between auto-mode units (#1217)
- Two-column dashboard layout with task checklist (#1195)

### Changed
- move .gsd/ to external state directory with symlink (ADR-002) (#1242)
- replace MCPorter with native MCP client (#1210)
- extend json-persistence utility and migrate top JSON I/O callsites (#1216)
- deduplicate dispatchDoctorHeal — keep single copy in commands-handlers.ts (#1211)
- remove facade re-exports from auto.ts — import directly from source modules (#1214)
- extract shared HTTP client for remote-questions adapters (#1212)

## [2.29.0] - 2026-03-18

### Added
- add searchExcludeDirs setting for @ file autocomplete blacklist (#1202)
- **ci**: automate prod-release with version bump, changelog, and tag push (#1194)
- auto-open HTML reports in default browser on manual export (#1164)
- upgrade to Node.js 24 LTS across CI, Docker, and package config (#1165)
- add /gsd logs command to browse activity, debug, and metrics logs (#1162)
- **browser-tools**: configurable screenshot resolution, format, and quality (#1152)
- add pre-commit secret scanner and CI secret detection (#1148)
- **mcporter**: add .gsd/mcp.json per-project MCP config support (#1141)
- **metrics**: add API request counter for copilot/subscription users (#1140)
- per-milestone depth verification + queue-flow write-gate (#1116)
- add OSC 8 clickable hyperlinks for file paths in export notifications (#1114)
- park/discard actions for in-progress milestones (#1107)
- **ci**: implement three-stage promotion pipeline (Dev → Test → Prod) (#1098)
- cache-ordered prompt assembly and dashboard cache hit rate (#1094)
- add comprehensive API key manager (/gsd keys) (#1089)
- **ci**: add multi-stage Dockerfile for CI builder and runtime images
- **gsd**: add directory safeguards for system/home paths (#1053)
- enhance HTML report with derived metrics, visualizations, and interactivity (#1078)
- auto-extract lessons to KNOWLEDGE.md on slice/milestone completion (#711) (#1081)
- auto-create PR on milestone completion (#687) (#1084)
- wire semantic chunking, add preferences, metrics, and docs
- add token optimization suite for prompt caching, compression, and smart context selection
- **autocomplete**: add /thinking completions, GSD subcommand descriptions, and test coverage (#1019)
- add respectGitignoreInPicker setting for @ file picker (#979) (#1016)
- **prefs**: add search_provider to preferences.md (#1001)
- add `--events` flag for JSONL stream filtering (#1000)
- add 10 bundled skills for UI, quality, and code optimization (#999)
- **ux**: group model list by provider in /gsd prefs wizard (#993)
- add `--answers` flag for headless answer injection (#982)
- add project onboarding detection and init wizard

### Fixed
- **ci**: add npm publish to prod-release and prevent mid-deploy cancellation (#1208)
- **ci**: use env var for Discord webhook secret in if-condition
- complete shared barrel exports and add import-claude to help text (#1198)
- broaden unit-runtime path sanitization to strip all unsafe characters
- detect stale bundled resources via content fingerprint (#1193)
- include promptGuidelines in customPrompt path of buildSystemPrompt (#1187)
- prevent branch-mode merge fallback from firing in worktree isolation (#1183)
- treat auto-discovered verification failures as advisory, not blocking (#1188)
- **ci**: remove @latest npm promotion from pipeline
- **ci**: skip GitHub release creation when tag already exists
- handle Windows non-ASCII paths in cpSync with copyFileSync fallback (#1181)
- non-blocking verification gate for auto-discovered commands (#1177)
- add defensive guards against undefined .filter() in auto-mode dispatch/recovery (#1180)
- sync living docs (DECISIONS/REQUIREMENTS/PROJECT/KNOWLEDGE) between worktree and project root (#1173)
- route needs-discussion phase to interactive flow instead of stopping (#1175)
- run resource-skew check before early TTY gate
- move TTY check before heavy initialization to prevent process hang
- **ci**: skip init smoke test in non-TTY CI environments (#1172)
- **ci**: skip publish when version already exists on npm (#1166)
- **ci**: use local binary for pipeline smoke test (#1163)
- prevent concurrent GSD sessions from overlapping on same project (#1154)
- exclude completion-transition errors from health escalation at task level (#1157)
- **ci**: skip git-diff guard in prepublishOnly during CI (#1160)
- /gsd quick respects git isolation: none preference (#1156)
- text-based fallbacks for RPC mode where TUI widgets produce empty turns (#1112)
- **headless-query**: use jiti to load extension .ts modules (#1143)
- pause auto-mode when env variables needed instead of blocking (#1147)
- **ci**: fix dev-publish version stamp and platform sync (#1145)
- **google-search**: add 30s timeout to Gemini API call (#1139)
- **verification-gate**: sanitize preference commands with isLikelyCommand (#1138)
- **auto-dashboard**: show trigger task label for hook units (#1136)
- **auto-worktree**: detect worktree structurally when originalBase is null (#1135)
- **model-resolver**: prefer provider's recommended variant over saved base model (#1131)
- **auto-worktree**: auto-commit project root dirty state before milestone merge (#1130)
- **guided-flow**: support re-discuss flow for already-discussed slices (#1129)
- dispatch guard skips parked milestones — they no longer block later milestone dispatch (#1126)
- worktree reassess-roadmap loop — existsSync fallback in checkNeedsReassessment (#1117)
- **lsp**: use where.exe on Windows to resolve command paths (#1134)
- **gsd-db**: auto-initialize database when tools are called (#1133)
- inline preferences path to fix remote questions setup (#1110) (#1111)
- **ci**: add safe.directory for containerized pipeline job (#1108)
- remove .gsd/ from tracking, ignore entire directory
- update tests for god-file decomposition
- strip model variant suffix for API key auth (#1097) (#1099)
- match both milestoneId and sliceId when filtering duplicate blocker cards
- add dispatch stall guards to prevent auto-mode pause after slice completion (#1073) (#1076)
- prevent summarizing phase stall by retrying dropped agent_end events (#1072) (#1074)
- use atomic writes for completed-units.json and invalidate caches in db-writer (#1069)
- reject prose Verify: fields from being executed as shell commands (#1066) (#1068)
- restore session model on error instead of reading stale global prefs (#1065) (#1067)
- prevent run-uat re-dispatch loop when roadmap checkbox update fails (#1063) (#1064)
- inline compareSemver in gsd extension to fix broken relative import (#1058)
- disable reasoning for MiniMax-M2.5 in alibaba-coding-plan provider (#1003) (#1055)
- improve LSP diagnostics when no servers detected (#1082) (#1086)
- prevent summarizing phase stall by retrying dropped agent_end events (#1072)
- switch alibaba-coding-plan to OpenAI-compat endpoint with proper compat flags (#1003)
- add barrel files for remote-questions, ttsr, and shared extensions (#1048)
- consolidate frontmatter parsing into shared module (#1040)
- always ensure tasks/ directory exists for slice units (#900) (#1050)
- centralize GSD timeout and cache constants (#1038)
- improve RemotePromptRecord.ref type safety (#1041)
- document silent catch handlers in browser-tools (#1037)
- use literal union types in RuntimeErrorJSON for type safety (#1034)
- extract sanitizeError to shared module and apply to ask-user-questions (#1033)
- deduplicate formatDateShort into shared/format-utils (#1032)
- add error handlers to visualizer overlay promise chains (#1027)
- **security**: use execFileSync in resolve-config-value to prevent shell operator bypass (#1025)
- **security**: use execFile for browser URL opening to prevent shell injection (#1022)
- prevent duplicate milestone IDs when generating multiple before persisting (#961) (#1018)
- consolidate duplicate formatting functions (#1011)
- **gsd**: delete orphaned complexity.ts (#1005)
- **search**: consolidate duplicate Brave API helpers (#1010)
- merge worktree to main when all milestones complete (#962) (#1007)
- **gsd**: deduplicate resolveGitHeadPath function (#1015)
- add missing package.json subpath exports and oauth stubs (#1014)
- **gsd**: consolidate string-array normalizer functions into shared utility (#1009)
- **browser-tools**: document intentional silent catches, add debug logging for others (#1013)
- consolidate duplicate VerificationCheck/Result type definitions (#1008)
- **gsd**: add GIT_NO_PROMPT_ENV to gitFileExec and deduplicate constant (#1006)
- **remote-questions**: add null coalesce for optional threadUrl (#1004)
- auto-resume on transient server errors, not just rate limits (#886) (#957)
- replace ambiguous compound question in reflection step (#963) (#1002)
- **gsd**: remove STATE.md update instructions from all prompts (#983)
- **gsd**: clear all caches after discuss dispatch so picker sees new CONTEXT files (#981)
- **auto**: dispatch retry after verification gate failure (#998)
- enforce GSDError usage and activate unused error codes (#997)
- unify extension discovery logic (#995)
- deduplicate tierLabel/tierOrdinal exports (#988)
- deduplicate getMainBranch implementations (#994)
- add error handling for unhandled promise rejections (#992)
- deduplicate formatTokenCount into shared format-utils (#987)
- add debug logging to silent catch blocks in auto.ts (#986)
- deduplicate formatDuration into shared format-utils (#989)
- add exports fields to pi-tui and pi-agent-core packages (#991)
- remove dead github-client.ts (never imported) (#990)
- deduplicate parseJSONL and unify MAX_JSONL_BYTES constant (#985)
- remove broken ./hooks export path from pi-coding-agent (#984)
- inline bundled extension path parsing in subagent

### Changed
- extract numeric validation helpers in prefs wizard (#1205)
- deduplicate projectRoot() and dispatchDoctorHeal() between commands.ts and commands-handlers.ts (#1203)
- extract shared JSON persistence utility, migrate metrics + routing-history + unit-runtime (#1206)
- remove unused preferences-hooks.ts re-export facade (#1207)
- remove commands.ts re-exports, import directly from submodules (#1204)
- extract frontmatter body extraction into shared helper (#1201)
- deduplicate projectRoot() — single source in commands.ts (#1197)
- extract PER_REQUEST_TIMEOUT_MS to shared types (#1196)
- update state — S01 planned, ready for execution
- **M001-1ya5a3/S01**: auto-commit after state-rebuild
- **M001-1ya5a3/S01**: auto-commit after research-slice
- decompose doctor.ts into types, format, and checks modules (#1096)
- extract milestone-ids and guided-flow-queue from guided-flow.ts (#1095)
- decompose preferences.ts, populate skills and models modules (#1091)
- decompose auto.ts into 6 focused modules (#1088)
- decompose commands.ts into 5 focused modules
- remove redundant test file, identify consolidation targets (#1070)
- batch 2 — consolidate preferences, convert 8 more files to node:test (#1061)
- consolidate tests by area, standardize on node:test (#1059)
- skip initResources when version matches, consolidate startup I/O (#1052)
- centralize magic numbers into constants.ts (#1044)
- **resource-loader**: extract syncResourceDir to eliminate triplicated sync logic (#1036)
- **bg-shell**: split 1604-line god file into tool, command, and lifecycle modules (#1049)
- **headless**: split 772-line god file into events, UI, and context modules (#1047)
- **gsd**: extract safeCopy/safeMkdir helpers to replace repetitive try/catch FS patterns (#1043)
- **gsd**: extract atomicWriteSync utility to replace 6 duplicate write-tmp-rename patterns (#1046)
- **gsd**: unify duplicate padRight/truncate into shared format-utils (#1045)
- **loader**: consolidate 5 duplicate package.json version reads into cached helper (#1042)
- **headless**: remove duplicate jsonLine, use serializeJsonLine from pi-coding-agent (#1039)
- fix unicode regex discrepancy and standardize function naming (#1031)
- fix chalk version mismatch and document pinned dependency rationale (#1030)
- add concurrency limits to unbounded Promise.all operations (#1029)
- optimize SSE streaming buffer to avoid quadratic string growth (#1024)
- reduce makeTreeWritable calls from 6 to 2 on startup (#1023)
- add domain-grouped re-exports for preferences module (#996)

## [2.28.0] - 2026-03-17

### Added
- `gsd headless query` command for instant, read-only state inspection — returns phase, cost, progress, and next-unit as parseable JSON without spawning an LLM session
- `/gsd update` slash command for in-session self-update
- `/gsd export --html --all` for retrospective milestone reports

### Fixed
- Failure recovery & resume safeguards: atomic file writes, OAuth fetch timeouts (30s), RPC subprocess exit detection, extension command context guards, bash temp file cleanup, settings write queue flush, LSP init retry with backoff, crash detection on session resume, blob garbage collection
- Consolidated duplicate `mcp-server.ts` into single implementation
- Consolidated duplicate `bundled-extension-paths.ts` into single module
- Removed duplicate `marketplace-discovery.test.ts` test file
- Established npm as canonical package manager
- Exported RPC utilities from pi-coding-agent public API
- Prompt system requires grammatical narration for clearer agent output

### Changed
- Updated documentation for v2.26 and v2.27.0 features
- Documented all `preferences.md` fields in reference and template
- Removed stale `.pi/agents/` files superseded by built-in agent definitions

## [2.27.0] - 2026-03-17

### Added
- HTML report generator with progression index across milestones
- Crash recovery for parallel orchestrator — persisted state with PID liveness detection
- Headless orchestration skill with supervised mode
- Verification enforcement gate for milestone completion
- `git.manage_gitignore` preference to opt out of automatic `.gitignore` changes

### Changed
- Encapsulated auto.ts state into AutoSession class (cleaner session lifecycle)
- Extracted 7 focused modules from auto.ts (auto-worktree-sync, resource staleness, stale escape)
- TUI dashboard cleanup, dedup, and feature improvements
- Reordered visualizer tabs and HTML report sections into logical groupings

### Fixed
- Single ENTER now correctly submits slash command argument autocomplete
- Web search loop broken with consecutive duplicate guard
- Transient network errors retried before model fallback
- Parallel worker PID tracking, spawn-status race, and exit persistence
- `/gsd discuss` now recommends next undiscussed slice
- Roadmap parser allows suffix text after `## Slices` heading
- User's model choice no longer overwritten when API key is temporarily unavailable
- Reassess-roadmap skip loop broken by preventing re-persistence of evicted keys
- LSP command resolution and ENOENT crash on Windows/MSYS
- Dispatch plan-slice when task plan files are missing
- Reduced CPU usage on long auto-mode sessions
- Orphan-prone child processes reaped across session churn
- Symlinked skill directories resolved in `always_use_skills` and preferences
- Replan-slice infinite loop and non-standard `finish_reason` crash
- Skip slice plan commit when `commit_docs` is false
- Context-pressure monitor wired to send wrap-up signal at 70%
- Missing STATE.md in fresh worktree no longer deadlocks pre-dispatch health gate
- Stale runtime unit files for completed milestones cleaned on startup
- Broken install detection with Windows symlink fallback
- Auto-restart headless mode on crash with exponential backoff
- Generic type preserved on `resolveModelId` through resolution

## [2.26.0] - 2026-03-17

### Added
- Model selector grouped by provider with model type, provider, and API docs fields
- `require_slice_discussion` option to pause auto-mode before each slice for human review
- Discussion status indicators in `/gsd discuss` slice picker
- Worker NDJSON monitoring and budget enforcement for parallel orchestration
- `gsd_generate_milestone_id` tool for multi-milestone unique ID generation
- Alt+V clipboard image paste shortcut on macOS
- Hashline edit mode integration into active workflow
- Fallback parser for prose-style roadmaps without `## Slices` section

### Fixed
- Windows path normalization in LLM-visible text to prevent bash failures
- Async bash job completion no longer triggers spurious LLM turns
- Native web_search limited to max 5 uses per response
- Completed milestone with summary no longer re-entered as active on resume
- Replan-slice artifact verification breaks infinite replanning-slice loop
- Auto-heal STATE.md missing in preDispatchHealthGate
- Worktree artifact copy includes STATE.md, KNOWLEDGE.md, OVERRIDES.md
- Transient network errors marked as retriable in Anthropic provider
- `needs-remediation` treated as terminal validation verdict to prevent hard loop
- Post-hook doctor uses fixLevel 'all' to fix roadmap checkboxes
- `task_done_missing_summary` fixable in doctor to prevent validate-milestone skip loop
- BMP clipboard images on WSL2 handled via wl-paste PNG conversion
- Extended idle timeout for headless new-milestone
- EPIPE handling in LSP sendNotification with proper process exit wait
- Debug logging for silent early-return paths in dispatchNextUnit
- Untracked .gsd/ state files removed before milestone merge checkout
- Crash prevention when cancelling OAuth provider login dialog
- Resource staleness check compares gsdVersion instead of syncedAt
- Unique temp paths in saveFile() to prevent parallel write collisions
- Validation/summary file generation for completed milestones during migration
- Cache invalidation before initial state derivation in startAuto
- Headless mode no longer exits early on progress notifications containing 'complete'

### Removed
- Symlink-based development workflow (reverted PR #744)

### Changed
- Explicit Gemini OAuth ToS warning added to README — recommends API keys over OAuth
- Documentation updated for v2.24 release features
- Bug report template updated with model type, provider, and API docs fields

## [2.25.0] - 2026-03-16

### Added
- Native web search results rendering in TUI with `PREFER_BRAVE_SEARCH` environment variable toggle
- Meaningful commit messages generated from task summaries instead of generic messages
- Incremental memory system for auto-mode sessions
- Visualizer enriched with stats and discussion status
- 14 new E2E smoke tests for CLI verification

### Fixed
- Phantom skip loop caused by stale crash recovery context
- Skip-loop now interruptible and counts toward lifetime cap
- Cache invalidation consistency — orphaned `invalidateStateCache()` calls replaced, DB artifact cache included in `invalidateAllCaches()`
- Plan checkbox reconciliation on worktree re-attach after crash

### Changed
- Removed unnecessary `as any` casts, dead exports, and duplicate code
- Updated documentation for v2.22 and v2.23 release features

## [2.24.0] - 2026-03-16

### Added
- **Parallel milestone orchestration** — run multiple workers across phases simultaneously
- Dashboard view for parallel workers with 80% budget alert
- Headless `new-milestone` command for programmatic milestone creation
- Interactive update prompt on startup when a new version is available
- Symlink-based development workflow for `src/resources/`
- Descriptions added to `/gsd` autocomplete commands
- `validate-milestone` phase and dispatch

### Fixed
- Sync `completed-units.json` across worktree boundaries
- Worktree artifact verification uses correct base path
- Auto-resume auto-mode after rate limit cooldown
- Raise `maxDelayMs` default from 60s to 300s for better rate-limit handling
- Downgrade `missing_tasks_dir` to warning for completed slices
- Prevent stale state loop on auto-mode restart with existing worktree
- Always sync bundled resources and clean stale files
- Add stop reason to every auto-mode stop
- Skip redundant checkout in worktree merge when main already current
- Prevent runaway execute-task when task plan missing after failed research
- Fix read-only file permissions after cpSync from Nix store
- Fix parallel sendMessage calls missing required fields
- Strip clack UI from postinstall, keep silent Playwright download

### Changed
- Lazy-load LLM provider SDKs to reduce startup time

## [2.23.0] - 2026-03-16

### Added
- **VS Code extension** — full extension with chat participant, RPC integration, marketplace publishing under FluxLabs publisher
- **`gsd headless`** — redesigned headless mode for full workflow orchestration: auto-responds to prompts, detects completion, supports `--json` output and `--timeout` flags
- **`gsd sessions`** — interactive session picker for browsing and resuming saved sessions (#721)
- **10 new browser tools** — `browser_save_pdf`, `browser_save_state`, `browser_restore_state`, `browser_mock_route`, `browser_block_urls`, `browser_clear_routes`, `browser_emulate_device`, `browser_extract`, `browser_visual_diff`, `browser_zoom_region`, `browser_generate_test`, `browser_check_injection`, `browser_action_cache` (#698)
- **Structured discussion rounds** — `ask_user_questions` in guided-discuss-milestone for better requirement gathering (#688)
- **`validate-milestone` prompt** — milestone validation prompt and template
- **`models.json` resolution** — custom model definitions with fallback to `~/.pi/agent/models.json`

### Changed
- **Background shell performance** — optimized hot path with parallel git queries and lazy workspace validation

### Fixed
- Forensics uses `GSD_VERSION` env var instead of fragile package.json path traversal; now worktree-aware to prevent stale root misdiagnosis
- Background commands rewritten to prevent pipe-open hang; stalled-tool detection added with prompt guidance
- Auto mode breaks infinite skip loop on repeatedly-skipped completed units
- Roadmap parser expands range syntax in depends (e.g. `S01-S04` → `S01,S02,S03,S04`)
- Empty scaffold plan files rejected during plan-slice artifact verification (#699)
- Anti-pattern rule prevents `bash &` usage that causes agent hangs (#733)
- Shift-Tab navigates to previous tab in workflow visualizer (#717)
- Capture resolutions executed after triage instead of only classified (#714)
- Screenshot constraining uses independent width/height caps (#725)
- `auto.lock` written at startup; remote sessions detected in dashboard (#723)
- Cross-platform test compatibility with `process.ppid`
- CSP nonce, dead branch cleanup, restart cooldown fixes
- CI fix: `pi.getActiveTools()` replaces `ctx.getActiveTools()`

## [2.22.0] - 2026-03-16

### Added
- **`/gsd forensics`** — post-mortem investigation of auto-mode failures with structured root-cause analysis
- **Claude marketplace import** — import Claude marketplace plugins as namespaced GSD components
- **MCP server mode** — run GSD as an MCP server with `--mode mcp`
- **`/review` skill** — code review with diff-aware context
- **`/test` skill** — test generation and execution
- **`/lint` skill** — linting integration
- **GitHub API client** — diff-aware context injection and tiktoken-based token counting
- **File watcher** — chokidar-based file watching for live updates
- **`git.isolation: "none"`** — disable worktree isolation for projects that don't need it
- **E2E smoke tests** — end-to-end test suite for extension integration
- **Subcommand help** — inline help text for all GSD subcommands

### Fixed
- `verificationBudget` passed correctly to execute-task prompt template
- Background shell worktree cwd detection normalized to prevent stale paths
- Skill loading made an active directive in auto-mode units
- Auto-worktree validated as real git worktree before use
- MCP server discovery from project-root `.mcp.json`
- Command injection surface eliminated in diff-context; file-watcher path resolution hardened
- Thinking level clamped to `low` for gpt-5.x models
- `completedAt` coerced to String in visualizer changelog sort
- Warp terminal added to unsupported Ctrl+Alt shortcut list
- Fractional slice IDs (e.g. S03.5) supported in roadmap parser
- `executorContextConstraints` provided to plan-slice template
- Worktree state synced to project root after each unit
- Initial state derived from worktree when one exists
- Hardware cursor auto-enabled in Warp terminal
- CSI 3J scrollback clear removed from TUI full redraws
- Worktree edge cases — `resolveGitDir`, `captureIntegrationBranch` guard, doctor path

## [2.21.0] - 2026-03-16

### Added
- **Browser tools TypeScript conversion** — `browser-tools/core.js` converted to TypeScript with c8 test coverage
- **SSRF protection on `fetch_page`** — blocks private IPs, metadata endpoints, and non-HTTP protocols
- **Stale async job cancellation** — heuristic prevents outdated results in auto-mode

### Changed
- **Pause/resume recovery** — reuses crash recovery infrastructure for more reliable context restoration
- **Build scripts extracted** — inline package.json scripts moved to standalone files for cross-platform support
- **Help text deduplicated** — consolidated across CLI entry points
- **Dependency alignment** — `@types/mime-types` moved to devDependencies, chalk versions consolidated

### Fixed
- Task counter display no longer shows "task 5/4" after loop recovery
- Browser-tools TypeScript type errors in CI
- 4 small issues (#663): Windows GitHub Copilot login, Tavily display, MCPorter auto-install, notification preferences
- Cross-platform `validate-pack` script compatibility

## [2.20.0] - 2026-03-16

### Added
- **Telegram remote questions** — receive and respond to GSD questions via Telegram bot alongside existing Slack and Discord channels (#645)
- **`/gsd quick`** — execute a quick task with GSD guarantees (atomic commits, state tracking) without the full planning overhead (#437)
- **`/gsd mode`** — workflow mode system with solo and team presets that configure defaults for milestone IDs, git commit behavior, and documentation settings (#651)
- **`/gsd help`** — categorized command reference with descriptions for all GSD subcommands (#630)
- **`/gsd doctor`** — 7 runtime health checks with auto-fix for common state corruption issues (#646)
- **Agent instructions injection** — `agent-instructions.md` loaded into every agent session for persistent per-project behavioral guidance (#437)
- **Skill lifecycle management** — telemetry tracking, health dashboard, and heal-skill command for managing custom skills (#599)
- **SQLite context store** — surgical prompt injection from structured knowledge base for precise context engineering (#619)
- **Context-window budget engine** — proportional prompt sizing that allocates context budget across system prompt sections based on relevance (#660)
- **LSP activated by default** — Language Server Protocol now auto-activates with call hierarchy, formatting, signature help, and synchronized edits (#639)
- **Extension smoke tests** — CI catches import failures, circular deps, and module resolution issues across all bundled extensions
- **`gsd --debug` mode** — structured JSONL diagnostic logging for troubleshooting dispatch and state issues (#468)
- **Worktree post-create hook** — run custom setup scripts when GSD creates a new worktree (#597)

### Fixed
- **CPU spinning from regex backtracking** — replaced `[\s\S]*?` regex in preferences parser with indexOf-based scanning (#468)
- **Model config bleed between concurrent GSD instances** — isolated model configuration per session (#650)
- **Onboarding wizard repeats** — skip onboarding for extension-based providers that don't require auth.json credentials (#589)
- **Session tool rebuild on cwd change** — tools now rebuild correctly when working directory changes mid-session (#633)
- **Auto mode state derivation after discussion fallthrough** — re-derives state to prevent stale dispatches (#609)
- **Milestone branch preservation on auto stop** — prevents work loss when stopping auto mode (#601)
- **Infinite loop when milestone detection silently fails** — `findMilestoneIds` now logs errors and warns instead of looping (#456)
- **Google Search OAuth fallback** — uses Google Cloud Code Assist API when `GEMINI_API_KEY` is not set (#466)

### Changed
- **Preferences wizard** — replaced serial flow with categorized menu for faster configuration (#623)
- **Slack remote questions** — brought to feature parity with Discord integration (#628)
- **YAML support in hooks** — hooks now support YAML configuration alongside JSON (#637)

## [2.19.0] - 2026-03-16

### Added
- **Workflow visualizer** — `/gsd visualize` opens a full-screen TUI overlay with four tabs: Progress (milestone/slice/task tree), Dependencies (ASCII dep graph), Metrics (cost/token bar charts), and Timeline (chronological execution history). Supports Tab/1-4 switching, per-tab scrolling, auto-refresh every 2s, and optional auto-trigger after milestone completion via `auto_visualize` preference (#626)
- **Mid-execution capture & triage** — `/gsd capture` lets you fire-and-forget thoughts during auto-mode. The system triages accumulated captures at natural seams between tasks, classifies impact into five types (quick-task, inject, defer, replan, note), and proposes action with user confirmation. Dashboard shows pending capture count badge. Capture context injected into replan and reassess prompts (#512)
- **Dynamic model routing** — complexity-based model routing classifies units into light/standard/heavy tiers and routes to cheaper models when appropriate, reducing token consumption 20-50% on capped plans. Includes budget-pressure-aware routing, cross-provider cost comparison, escalation on failure, adaptive learning from routing history (rolling 50-entry window with user feedback support), and task plan introspection (code block counting, complexity keyword detection) (#579)
- **Feature-branch lifecycle integration test** — proves milestone worktrees branch from and merge back to feature branches, never touching main (#624)
- **Discord integration parity with Slack** — plus new remote-questions documentation (#620)

### Fixed
- **Absolute paths in auto-mode prompts** — write-target variables now passed as absolute paths, eliminating LLM path confusion in worktree contexts that caused artifacts written to wrong location and loop detection (#627)
- **Worktree lifecycle on mid-session milestone transitions** (#616, #618)
- **Eager template cache warming** — prevents version-skew crash in long auto-mode sessions (#621)

## [2.18.0] - 2026-03-16

### Added
- **Milestone queue reorder** — `/gsd queue` supports reordering milestone execution priority with dependency-aware validation, persistent ordering via `.gsd/QUEUE-ORDER.json` (#460)
- **`.gsd/KNOWLEDGE.md`** — persistent project-specific context file loaded into agent prompts. New `/gsd knowledge` command with `rule`, `pattern`, and `lesson` subcommands for adding entries (#585)
- **Dynamic model discovery** — runtime model enumeration from provider APIs (Ollama, OpenAI, Google, OpenRouter) with per-provider TTL caching and discovery adapters. New `ProviderManagerComponent` TUI for managing providers with auth status and model counts (#581)
- **Expanded preferences wizard** — all configurable fields now exposed in the setup wizard, model ID validation, and `updatePreferencesModels()` for safe read-modify-write of model config (#580)
- **Comprehensive documentation** — 12 new docs covering getting started, auto-mode, commands, configuration, token optimization, cost management, git strategy, team workflows, skills, migration, troubleshooting, and architecture (#605)
- **`resolveProjectRoot()`** — all GSD commands resolve the effective project root from worktree paths instead of using raw `process.cwd()`, preventing path confusion across worktree boundaries (#602)
- **1,813 lines of new tests** — 13 new test files covering discovery cache, model discovery, model registry, models-json-writer, auto-worktree, derive-state-deps, in-flight tool tracking, knowledge, memory leak guards, preferences wizard fields, queue order, queue reorder E2E, and stale worktree cwd

### Fixed
- **Heap OOM during long-running auto-mode sessions** — four sources of unbounded memory growth: activity log serialized all entries for SHA1 dedup (now streaming writes with lightweight fingerprint), uncleaned `activityLogState` Map between sessions, unbounded `completedUnits` array (now capped at 200), and `dirEntryCache`/`dirListCache` growing without bounds (now evicted at 200 entries) (#611)
- **Stale worktree cwd after milestone completion** — three-layer fix: `escapeStaleWorktree()` at auto-mode entry, unconditional cwd restore in `stopAuto()`, and cwd restore on partial merge failure (#608)
- **Worktree created from integration branch instead of main** — `createAutoWorktree` reads integration branch from META.json, merge targets integration branch not hardcoded main (#606)
- **Milestone merge skipped in branch isolation mode** — branch-mode fallback detects `milestone/*` branch and performs squash-merge (#603)
- **`parseContextDependsOn()` destroys unique milestone ID case** — was lowercasing IDs, breaking dependency resolution (#604)
- **Tool-aware idle detection** — prevents false interruption of long-running tasks in auto-mode (#596)
- **Remote questions onboarding crash** — extracted `saveRemoteQuestionsConfig` into compiled src/ helper to avoid cross-boundary .ts import (#592)
- **`showNextAction` crash** — falls back to `select()` when `custom()` returns undefined (#447, #615)

### Changed
- Comprehensive update to preferences reference and configuration guide (#614)
- Auto-mode artifact writes scoped to active milestone worktree, preventing cross-milestone pollution (#590)

## [2.17.0] - 2026-03-15

### Added
- **Token optimization profiles** — `budget`, `balanced`, and `quality` presets that coordinate model selection, phase skipping, and context compression to reduce token usage by 40-60% on budget mode
- **Complexity-based task routing** — automatically classifies tasks as simple/standard/heavy and routes to appropriate models, with persistent learning from routing history
- **`git.commit_docs` preference** — set to `false` to keep `.gsd/` planning artifacts local-only, useful for teams where only some members use GSD

### Changed
- Updated Ollama cloud provider model catalog

### Fixed
- Native binary hangs in GSD auto-mode paths (#453)
- Auto-mode can be stopped from a different terminal (#586)
- Parse cache collision causing false loop detection on `complete-slice` (#583)
- Exhaustive switch handling and cleanup in Google provider (#587)

## [2.16.0] - 2026-03-15

### Added
- `/gsd steer` command — hard-steer plan documents during execution without stopping the pipeline
- Native git operations via libgit2 — ~70 fewer process spawns per dispatch cycle
- Native performance optimizations for `deriveState`, JSONL parsing, and path resolution
- Default model upgraded to Opus 4.6 with 1M context variant
- PR template and bug report issue template

### Fixed
- Auto-mode continues after guided milestone planning instead of stalling at "Milestone planned"
- Git commands no longer fail when repo path contains spaces
- Arrow key cursor updates and Shift+Enter newline insertion in TUI
- Tool API keys loaded from `auth.json` at session startup
- TypeScript errors resolved across extension, test, and async-jobs files

### Changed
- Hot-path lookup caching and error resilience optimizations
- Extension type-checking added to CI pipeline

## [2.15.1] - 2026-03-15

### Fixed
- Auto-mode worktree path resolution — prompt templates now include working directory, preventing artifacts from being written to the wrong location and causing infinite re-dispatches
- Auto-mode resource sync detection — gracefully stops when resources change mid-session instead of crashing
- Auto-mode missing import for `resolveSkillDiscoveryMode` causing crash on startup
- Auto-mode recovery hardened — checkbox verification falls through correctly, corrupt roadmaps fail verification instead of silently passing, atomic writes for completed-units.json, and task completion verified via artifacts not just file existence
- Auto-mode progress widget now refreshes from disk every 5 seconds during unit execution instead of appearing frozen
- Undo command now invalidates all caches (not just state cache), preventing stale results after undoing completed tasks

### Changed
- CI pipeline supports prerelease publishing with `--tag next` for testing before stable release

### Added
- Unit tests for auto-dashboard, auto-recovery, and crash-recovery modules (46 new tests)

## [2.15.0] - 2026-03-15

### Added
- **8 new commands**: budget enforcement, notifications, and quality-of-life improvements (#441)
- **Preferences schema validation**: detects unknown/typo'd preference keys and surfaces warnings instead of silently ignoring them (#542)
- **Pipeline-aware prompts**: each agent phase (research, plan, execute, complete) now knows its role in the pipeline, eliminating redundant code exploration between phases (#543)
- **Research depth calibration**: three-tier system (deep/targeted/light) so agents match effort to actual complexity (#543)

### Changed
- Auto-mode decomposed into focused modules for maintainability (#534)
- Dispatch logic extracted from if-else chain to dispatch table (#539)
- v1 migration code gated behind dynamic import — only loaded when needed (#541)
- Background shell module decomposed into focused modules
- Unified cache invalidation into single `invalidateAllCaches()` function (#545)

### Fixed
- Executor agents now receive explicit working directory, preventing writes to main repo instead of worktree (#543)
- Merge loop and .gsd/ conflict auto-resolution in worktree model, `git.isolation` preference restored (#536)
- Arrow keys no longer insert escape sequences as text during LLM streaming (#493)
- YAML preferences parser hardened for OpenRouter model IDs with special characters (#488)
- `@` file autocomplete debounced to prevent TUI freeze on large codebases (#448)
- Auto-mode stops cleanly when dispatch gap watchdog fails (#537)
- Synchronous I/O removed from hot paths (#540)
- Silent catch blocks now capture error references for crash diagnostics (#546)
- `ctx.log` error in GSD provider recovery path fixed
- TUI resource leaks patched in loader, cancellable-loader, input, and editor components (#482)
- Hardcoded ANSI escapes replaced with chalk for consistent terminal handling (#482)

## [2.14.4] - 2026-03-15

### Fixed
- **Session cwd update** — `newSession()` now updates the LLM's perceived working directory to reflect `process.chdir()` into auto-worktrees. Previously the system prompt was frozen at the original project root, causing the LLM to `cd` back and write files to the wrong location. This was the root cause of complete-slice and plan-slice loops in worktree-based projects.

## [2.14.3] - 2026-03-15

### Fixed
- **Copy planning artifacts into new auto-worktrees** — `createAutoWorktree` now copies `.gsd/milestones/`, `DECISIONS.md`, `REQUIREMENTS.md`, `PROJECT.md` from the source repo into the worktree. Prevents plan-slice loops in projects with pre-v2.14.0 `.gitignore`.

## [2.14.2] - 2026-03-15

### Fixed
- **Dispatch reentrancy deadlock** — `_dispatching` flag was never reset after first dispatch, permanently blocking all subsequent unit dispatches. Wrapped in try/finally.
- **`.gitignore` self-heal** — existing projects with blanket `.gsd/` ignore now auto-remove it on next auto-mode start, replacing with explicit runtime-only patterns so planning artifacts are tracked in git.
- **Discuss depth verification** — render summary as chat text (markdown renders), use ask_user_questions for short confirmation only.

## [2.14.1] - 2026-03-15

### Fixed
- **Quiet auto-mode warnings** — internal recovery machinery (dispatch gap watchdog, model fallback chain) downgraded to verbose-only. Users only see warnings when action is needed.
- **Dispatch recovery hardening** — artifact fallback when completion key missing, TUI freeze prevention, reentrancy guard, atomic writes, stale runtime record cleanup

## [2.14.0] - 2026-03-15

### Added
- **Discussion manifest** — mechanical process verification for multi-milestone context discussions
- **Session-internal `/gsd config`** — configure GSD settings within a running session
- **Model selection UI** — select list instead of free-text input for model preferences
- **Startup performance** — faster GSD launch via optimized initialization

### Changed
- **Branchless worktree architecture** — eliminated slice branches entirely. All work commits sequentially on `milestone/<MID>` within auto-mode worktrees. No branch creation, switching, or merging within a worktree. ~2600 lines of merge/conflict/branch-switching code removed.
- **`.gitignore` overhaul** — planning artifacts (`.gsd/milestones/`) are tracked in git naturally. Only runtime files are gitignored. No more force-add hacks.
- **Multi-milestone enforcement** — `depends_on` frontmatter enforced in multi-milestone CONTEXT.md

### Fixed
- **Auto-mode loop detection failures** — artifacts on wrong branch or invisible after branch switch no longer possible (root cause eliminated by branchless architecture)
- **Nested worktree creation** — auto-mode no longer creates worktrees inside existing manual worktrees, preventing wrong-repo state reads and "All milestones complete" false positives
- **Dispatch recovery hardening** — artifact fallback when completion key missing, TUI freeze prevention on cascading skips, reentrancy guard, atomic writes, stale runtime record cleanup, git index.lock cleanup
- **Hook orchestration** — finalize runtime records, add supervision, fix retry
- **Empty slice plan stays in planning** — no longer incorrectly transitions to summarizing
- **Prefs wizard** — launch directly from `/gsd prefs`, fix parse/serialize cycle for empty arrays
- **Discussion routing** — `/gsd discuss` routes to draft when phase is needs-discussion

### Removed
- `ensureSliceBranch()`, `switchToMain()`, `mergeSliceToMain()`, `mergeSliceToMilestone()`
- `shouldUseWorktreeIsolation()`, `getMergeToMainMode()`, `buildFixMergePrompt()`
- `withMergeHeal()`, `recoverCheckout()`, `fix-merge` unit type
- `git.isolation` and `git.merge_to_main` preferences (deprecated with warnings)

## [2.13.1] - 2026-03-15

### Fixed
- Windows: multi-line commit messages in `mergeSliceToMilestone` broke shell parsing — switched to `execFileSync` with argument arrays
- Windows: single-quoted git arguments and bash-only redirects in test files
- Windows: worktree path normalization for `shouldUseWorktreeIsolation` and stale branch detection

## [2.13.0] - 2026-03-15

### Added
- **Worktree isolation for auto-mode** — auto-mode creates isolated git worktrees per milestone, with `--no-ff` slice merges preserving commit history and squash merge to main on milestone completion
- **Self-healing git repair** — automatic recovery from detached HEAD, stale locks, and orphaned worktrees
- **Worktree-aware doctor** — git health diagnostics and worktree integrity checks
- **Isolation preferences** — choose between worktree and branch isolation modes

### Fixed
- **Dispatch loop: parse cache stale data** — `dispatchNextUnit()` cleared path cache but not parse cache, allowing stale roadmap checkbox state to persist through doctor→dispatch transitions (#462)
- **Dispatch loop: completion not persisted after agent session** — `handleAgentEnd()` now verifies artifacts and persists the completion key before re-entering the dispatch loop, preventing re-dispatch when `deriveState()` sees pre-merge branch state (#462)
- **Dispatch loop: recovery counter reset without persistence** — loop-recovery and self-repair paths now persist completion keys and include a hard lifetime dispatch cap of 6 (#462, #463)
- **Dispatch loop: non-execute-task units had no artifact verification** — `complete-slice`, `plan-slice`, and other unit types now verify artifacts on disk before bail-out (#465)
- `@` file autocomplete debounced to prevent TUI freeze on large codebases (#452)
- Guard against newer synced resources from future versions (#445)
- Prevent `web_search` tool injection for non-Anthropic providers serving Claude models (#446)

## [2.12.0] - 2026-03-15

### Added
- **Parallel tool calling** — tools from a single assistant message execute concurrently by default, with sequential mode as opt-in (`toolExecution: "sequential"`) and `beforeToolCall`/`afterToolCall` hooks for interception
- **Ollama Cloud** as model and web tool provider
- **Extensible hook system** for auto-mode state machine — post-unit hooks fire after unit completion
- **Event queue settlement** for parallel tool execution — extension `tool_call`/`tool_result` handlers always see settled agent state

### Changed
- Inline static templates into prompt builders, eliminating ~44 READ tool calls per milestone

### Fixed
- Auto-mode dispatch loop when `cachedReaddir` returns stale data after unit writes files
- Parse and path caches cleared alongside state cache after unit completion
- `bg_shell` hangs indefinitely when `ready_port` server fails to start — now transitions to error state with stderr context
- Em dash and slash characters in milestone/slice titles corrupting GSD state management
- Guided-flow self-heals stale runtime records from crashed auto-mode sessions on wizard start
- CI smoke test ANSI code stripping

## [2.11.1] - 2026-03-15

### Fixed
- **URGENT: auto-mode loops on research-slice and plan-slice** — `handleAgentEnd` called `invalidateStateCache()` but not `clearPathCache()` or `clearParseCache()`. The in-process directory listing cache in `paths.ts` retained the pre-subagent empty directory snapshot, so `resolveSliceFile()` returned `null` for artifacts the subagent had just written. This caused `dispatchNextUnit` to re-dispatch the same unit (`research-slice` or `plan-slice`) instead of advancing, incrementing the dispatch counter until the `MAX_UNIT_DISPATCHES=3` limit triggered a hard stop with "Loop detected" (#421)

## [2.11.0] - 2026-03-14

### Added
- Cross-provider fallback when rate or quota limits are hit (#125)
- Custom OpenAI-compatible endpoint option in onboarding wizard (#335)
- Model provider selection in preferences (#350)
- Auto-mode fallback model rotation on network errors (#386)
- Native libgit2-backed git read operations for dispatch hotpath (#388)

### Changed
- Replace hardcoded extension list with dynamic discovery in loader
- Deduplicate transitive dependency summaries in prompt builders
- Reduce dispatch gap timeout from 30s to 5s
- Memoize `deriveState()` per dispatch cycle
- Wire native batch parser into `deriveState()` hotpath (#389)
- Add session-scoped directory listing cache and content-hash-keyed parse cache for path resolution
- Optimize discovery and interactive hot paths

### Fixed
- Resolve OpenRouter model IDs in auto-mode and show active model per phase
- Suppress git-svn noise causing confusing errors on affected systems (#404)
- Include export-html templates in pkg/ shim (#370, #395)
- Increase timeout for z.ai provider to handle slow API spikes (#379, #396)
- Prevent login dialog from leaving dangling promises that freeze the UI (#280, #390)
- Improve Cloud Code Assist 404 error with actionable model guidance (#384)
- Prevent auto-mode hang when dispatch chain breaks after slice tasks complete (#381, #382)
- Fix packaging verification and path portability (#378)
- Read resources from dist/ to prevent branch-drift in npm-link setups (#314)
- Always use native Anthropic web search when available (#374)
- CI smoke test — wait for registry propagation, show errors (#383)
- Bypass pre-commit hooks on GSD infrastructure commits to prevent lint-staged empty commit errors (#385)

## [2.10.12] - 2026-03-14

### Added
- Multi-milestone readiness flow with per-milestone discussion gate (#377)

### Fixed
- Fix `npx gsd-pi@latest` failing with `ERR_MODULE_NOT_FOUND: Cannot find package '@gsd/pi-coding-agent'`. The loader now creates workspace package symlinks at runtime before importing, so it works even when `npx` skips postinstall scripts (#380)

## [2.10.11] - 2026-03-14

### Fixed
- Hoist workspace package dependencies (undici, anthropic SDK, openai, chalk, etc.) into root `dependencies` so they install for end users. v2.10.10 removed `bundleDependencies` but didn't promote the transitive deps (#376)
- Add `undici` as root dependency to resolve startup crash (#372)
- Check `GROQ_API_KEY` before entering voice mode to prevent crash (#367)

## [2.10.10] - 2026-03-14

### Added
- Alibaba Cloud coding-plan provider support (#295)
- Linux voice mode: Groq Whisper API backend for fast, accurate speech-to-text (#366)
- Opus 4.6 1M as default model, model selector UX improvements, Discord onboarding (#290)

### Fixed
- Fix broken `npm install` / `npx gsd-pi@latest` caused by unpublished `@gsd/*` workspace packages leaking into npm dependencies. Workspace cross-references removed from published package metadata; packages resolve via bundled `node_modules/` at runtime (#369)
- Add pre-publish tarball install validation (`validate-pack`) to CI and publish pipeline, preventing broken packages from reaching npm
- Handle empty index after runtime file stripping in squash-merge (#364)
- Add retry logic for transient network/auth failures instead of crashing (#365)
- Auto-mode: stale lock detection, SIGTERM handler, live-session guard (#362)

## [2.10.9] - 2026-03-14

### Added
- Team collaboration: multiple users can work on the same repo without milestone name clashes by checking in `.gsd/` planning artifacts (#338)

### Changed
- Execute-task loop detection uses adaptive reconciliation instead of hard-stopping, reducing false positives (#342)
- Memory storage switched from better-sqlite3 to sql.js (WASM) for Node 25+ compatibility (#356)

### Fixed
- Node 22.22+ compatibility: `.ts` import extensions normalized to `.js` for module resolution (#354)
- Infinite loop when complete-slice merges to main are interrupted (#345)
- Credential backoff no longer triggers on transport errors; quota exhaustion handled gracefully (#353)
- OAuth-backed providers (Gemini) no longer crash on quota exhaustion (#347)
- Secrets skip in auto mode no longer crashes (#352)
- Untracked runtime files discarded before branch switch to prevent checkout conflicts (#346)
- TUI crash/corruption on code blocks with lines exceeding terminal width (#343)
- Infinite skip loop in `gsd auto` broken by adding roadmap completion check
- Model ID variant suffix stripped correctly for OAuth Anthropic API calls
- `.gsd/` planning artifacts force-added and `handleAgentEnd` reentrancy guarded (#341)

## [2.10.8] - 2026-03-14

### Fixed
- Publish verification checks `dist/loader.js` is non-empty (`-s`) and uses `--ignore-scripts` on `npm pack --dry-run` to match actual publish behaviour (#298)

## [2.10.7] - 2026-03-14

### Added
- GitHub Workflows skill with CI workflow template and `ci_monitor` tool (#294)
- Auto-resolve merge conflicts via LLM-powered fix-merge session
- Auto-update integration branch when user starts auto-mode from a different branch (#300)

### Changed
- Secrets manifest is re-checked before every dispatch, not just at auto mode start
- Replaced TS parameter properties with explicit fields for Node strip-types compatibility
- Hardened CI publish pipeline to prevent broken releases (#304)

### Fixed
- Unresolvable artifact paths now correctly treated as stale completion state, preventing OOM crashes (#313)
- Eliminated branch checkout during slice merge that caused STATE.md conflicts (#307)
- Removed infinite delivery retry loop for background job completions (#301)
- Display ⌥ instead of Alt for keybindings on macOS (#299)

### Removed
- Deprecated legacy dead code from OAuth module

## [2.10.6] - 2026-03-13

### Added
- Native Rust output truncation module for efficient large-output handling (#268)
- Native Rust xxHash32 hasher for hashline IDs — faster line hashing (#272)
- Native Rust bash stream processor for single-pass chunk processing (#271)
- Memory extraction pipeline (#261)
- `claude-opus-4-6` model with 1M context window (#288)

### Fixed
- Oversized TUI lines now truncated instead of crashing (#287)
- Anthropic rate limit backoff now respects server-requested retry delay
- CI publish guard: skip main package publish if already on npm
- Strip hashline prefixes from TUI read output (#265)

## [2.10.5] - 2026-03-13

### Added
- Async background jobs extension for non-blocking task execution (#260)
- Multi-credential round-robin with rate-limit fallback across API keys
- Bash interceptor to block commands that duplicate dedicated tools (Read, Write, Edit, Grep, Glob)
- `gsd update` subcommand for self-update (#273)
- Task isolation for subagent filesystem safety (#254)
- Native Rust streaming JSON parser (#266)
- Web search provider selection added to onboarding wizard (#278)

### Changed
- Simplified onboarding into two-step auth flow — plain language instead of OAuth jargon (#274)

### Fixed
- `optionalDependencies` in published `gsd-pi@2.10.4` were still pinned to `2.10.2`, causing users to install the broken engine binaries that 2.10.4 was meant to fix (#276)
- Auto-resolve `.gsd/` planning artifact conflicts during slice merge (#264)
- Use version ranges for native engine optional dependencies (#286)
- Guard publish against uncommitted version sync changes
- Show 'keep current' option in config when already authenticated (#283)
- Restore bashInterceptor settings dropped by async-jobs merge
- Collapse tool output by default

## [2.10.4] - 2026-03-13

### Fixed
- Native binary distribution — `.node` binaries were missing from the npm tarball, causing startup crashes on all platforms since v2.10.0
- Native loader resolution chain: tries `@gsd-build/engine-{platform}` npm package first, then local dev build, with clear error messages listing supported platforms

### Added
- Per-platform optional dependency packages (`@gsd-build/engine-*`) for macOS (ARM64/x64), Linux (x64/ARM64), and Windows (x64)
- Cross-platform native binary CI build and publish workflow
- Version synchronization script for lock-step platform package releases

## [2.10.2] - 2026-03-13

### Added
- Native Rust TTSR regex engine — pre-compiles all stream rule conditions into a single `RegexSet` for one-pass DFA matching instead of O(rules × conditions) JS regex iteration
- Native Rust diff engine — fuzzy text matching (`fuzzyFindText`, `normalizeForFuzzyMatch`) and unified diff generation (`generateDiff`) via the `similar` crate, replacing the `diff` npm package
- Native Rust GSD file parser — frontmatter parsing, section extraction, batch `.gsd/` directory parsing, and structured roadmap parsing with transparent JS fallback

## [2.10.1] - 2026-03-13

### Fixed
- `@gsd/native` package ships pre-compiled JavaScript instead of raw TypeScript, fixing startup crashes on Node.js 20, 22, and 24 (#248)

## [2.10.0] - 2026-03-13

### Added
- Native Rust engine with high-performance N-API modules replacing JS/WASM dependencies:
  - **grep** — ripgrep-backed content and filesystem search
  - **glob** — gitignore-aware file discovery with scan caching
  - **ps** — cross-platform process tree management
  - **clipboard** — native clipboard access via arboard (text + image)
  - **highlight** — syntect-based syntax highlighting (replaces `cli-highlight`)
  - **ast** — structural code search and rewrite via ast-grep (38+ languages)
  - **html** — HTML-to-Markdown conversion
  - **text** — ANSI-aware text measurement, wrapping, truncation, and slicing
  - **fd** — fuzzy file path discovery for autocomplete
  - **image** — decode, encode, and resize images (PNG, JPEG, GIF, WebP)
- Background shell `env` action to query shell session environment state
- Background shell `run` action for blocking command execution on persistent sessions
- Background shell `session` process type for persistent interactive sessions
- Hashline edits — line-hash-anchored file editing
- Universal config discovery extension

### Changed
- Find tool uses native Rust glob instead of `fd` CLI binary
- Syntax highlighting uses native syntect instead of `cli-highlight` npm package
- Autocomplete uses native fd module instead of `fd` CLI subprocess
- Text utilities (visible width, wrapping, truncation, slicing) use native Rust instead of JS
- Clipboard operations use native arboard instead of platform-specific CLI tools
- Image processing uses native Rust `image` crate instead of Photon WASM

### Fixed
- Prevent move operation from silently overwriting existing files
- Separate access/unlink error handling in delete path
- Untrack runtime files from slice branch before squash-merge
- Copy LSP defaults.json to dist during build
- Native module test assertions

## [2.9.0] - 2026-03-13

### Added
- LSP tool — full Language Server Protocol integration with diagnostics, go-to-definition, references, hover, document/workspace symbols, rename, code actions, type definition, and implementation support
- `/thinking` slash command for toggling thinking level during sessions
- Interactive wizard mode for `/gsd prefs` with guided configuration
- Startup update check with 24-hour cache — notifies when a new version is available

### Fixed
- TypeScript type errors across gsd, browser-tools, search-the-web, and misc extension files
- Milestone ID generation uses max-based approach instead of length+1 (prevents ID collisions)
- Non-thinking models handled correctly in `/thinking` command
- Auto-mode pauses on provider errors to prevent reassess-roadmap loop
- TAB hint displayed for notes input in discuss-mode survey
- Slice branches merge to integration branch instead of main
- Prefs wizard audit findings addressed
- Deduplicated maxNum logic with test coverage
- Command injection eliminated in LSP config `which()` function
- Unhandled JSON.parse in LSP message reader wrapped with error handling

## [2.8.3] - 2026-03-13

### Fixed
- `ask_user_questions` handles undefined `custom()` result in RPC mode
- Provider-aware model resolution for per-phase preferences (respects `provider` field instead of parsing model name prefixes)
- Execute-task artifact verification aligned with `deriveState` — adds self-repair for missing artifacts
- Research phase infinite loop broken; state synced on stop
- Auto-resolve merge conflicts on `.gsd/` runtime files
- Auto-switch model after `/login` and `/logout` to prevent API key errors
- Anthropic provider detection uses `provider` field instead of model name prefix matching

## [2.8.2] - 2026-03-13

### Fixed
- Path operations use `node:path` stdlib instead of hardcoded forward slashes, fixing cross-platform compatibility
- Prompts use relative paths to prevent Windows drive letter mangling
- Runtime files already in the git index are untracked to prevent merge conflicts
- HTTP_PROXY and HTTPS_PROXY environment variables respected for all outbound requests
- Windows NUL redirects sanitized to /dev/null in Git Bash environments

### Changed
- `.claude/` and `.gsd/` directories untracked from repo, `*.tgz` gitignored

## [2.8.1] - 2026-03-13

### Added
- Discussion depth verification and context write-gate for richer milestone discussions
- TTSR + blob/artifact storage (ported from oh-my-pi)
- Skip/discard escape hatches in no-roadmap wizard
- Configurable `merge_strategy` preference for slice completion

### Fixed
- `fsevents` bumped to ~2.3.3 for Node 25 compatibility; added as optional dep for Linux installs
- Observability warnings injected into agent prompt for enforcement
- Auto-detect headless environment for Playwright browser launch
- UAT artifact verified before marking complete-slice done
- Prior slices must complete on main before next slice dispatches
- smartStage fallback bypasses runtime exclusions when `.gsd/` is gitignored
- `/exit` uses graceful shutdown instead of hard kill

## [2.8.0] - 2026-03-13

### Added
- Browser tools: `browser_analyze_form` and `browser_fill_form` — form field inventory and intelligent filling by label/name/placeholder
- Browser tools: `browser_find_best` — scored element candidates for semantic intents
- Browser tools: `browser_act` — execute common browser micro-tasks in one call
- Browser tools: 108 unit and integration tests covering all new components

### Changed
- Browser tools: decomposed 5000-line monolithic `index.ts` into focused modules (state, capture, settle, lifecycle, refs, utils) with 11 categorized tool files
- Browser tools: consolidated state capture reduces evaluate round-trips per action
- Browser tools: zero-mutation settle short-circuit for faster page interaction
- Browser tools: conditional body text capture — low-signal tools skip it for smaller token payloads
- Browser tools: screenshot resizing uses `sharp` instead of canvas evaluate calls
- Browser tools: screenshots opt-in on navigate (no longer sent by default)

## [2.7.1] - 2026-03-13

### Added
- Model fallback support for auto-mode phases — if the configured model fails, GSD tries alternate models before stopping
- `/kill` command for immediate process termination

### Fixed
- `npm install -g gsd-pi` now works — workspace packages bundled in npm tarball via `bundleDependencies`
- External PI ecosystem packages (pi-rtk, pi-context, etc.) can now resolve `@mariozechner/*` imports through jiti aliases
- Missing `export-html` vendor files (marked.min.js, highlight.min.js) restored
- Skipped API keys now persist so the setup wizard doesn't repeat on every launch
- Provider config and extension loading reused correctly

### Changed
- `/exit` uses graceful shutdown (saves session state); `/kill` replaces the old immediate-exit behavior

## [2.7.0] - 2026-03-12

### Changed
- Vendor Pi SDK source (tui, ai, agent-core, coding-agent) into workspace monorepo under `packages/`, replacing the compiled npm dependency and patch-package workflow. Pi internals are now directly modifiable as TypeScript source.
- Existing patches (setModel persist option, Windows VT input caching) applied as source edits.
- Build pipeline runs workspace packages in dependency order before GSD compilation.
- Removed `patch-package` from devDependencies and postinstall.

## [2.6.0] - 2026-03-12

### Added
- Proactive secret management — planning phase forecasts required API keys into a manifest; auto-mode collects pending secrets before dispatching the first slice
- `--continue` / `-c` CLI flag to resume the most recent session

### Fixed
- Doctor post-hook no longer preempts `complete-slice` dispatch
- `main_branch` preference restored; `runPreMergeCheck` implemented for merge safety
- Recovery/retry prompt injection capped to prevent V8 OOM on large sessions
- `.gsd/` excluded from pre-switch auto-commits to prevent squash merge conflicts

## [2.5.1] - 2026-03-12

### Added
- `secure_env_collect` now auto-detects existing keys, destination files, and provides guidance field for better onboarding UX

### Changed
- Right-sized pipeline for simple work — single-slice milestones skip redundant research/plan sessions, reducing 9-10 sessions to 5-6
- Heavyweight plan sections (Proof Level, Integration Closure, Observability) are now conditional, omitted for simple slices

### Fixed
- Squash-merge now aborts cleanly on conflict and stops auto-mode instead of looping with corrupted state
- Resolved baked-in merge conflict markers in loader.ts, logo.ts, and postinstall.js

## [2.5.0] - 2026-03-12

### Added
- Native Anthropic web search — Claude models get server-side web search automatically, no Brave API key required
- GitService fully wired into codebase — programmatic git operations replace shell-based git commands in prompts
- Merge guards prevent slice completion when uncommitted changes or conflicts exist
- Snapshot support for saving and restoring `.gsd/` state
- Auto-push after slice squash-merge to main
- Rich commit messages with structured metadata

### Fixed
- State machine deadlock when units fail to produce expected artifacts — retry and cross-validation now gate completion
- Duplicate Brave search tools when toggling providers repeatedly
- Windows test glob patterns (single quotes → unquoted for shell expansion)
- Conversation replay error caused by thinking blocks in stored history
- Brave search tools removed from API payload when no `BRAVE_API_KEY` is set
- Restore notifications suppressed on session resume to reduce UX noise

## [2.4.0] - 2026-03-12

### Added
- Automatic migration of provider credentials from existing Pi installations — skip re-authentication when switching to GSD
- Pi extensions from `~/.pi/agent/extensions/` discoverable in interactive mode
- GitService core implementation for programmatic git operations

### Changed
- System prompt compressed by 48% (360 → 187 lines) for better context efficiency
- Refined agent character and communication style prompts
- Added craft standards, self-debugging awareness, and work narration to agent prompts

### Fixed
- RPC mode crash when `ctx.ui.theme` is undefined (#121)

## [2.3.11] - 2026-03-12

### Added
- Branded clack-based onboarding wizard on first launch — LLM provider selection (OAuth + API key), optional tool API keys, and setup summary (#118)
- `gsd config` subcommand to re-run the setup wizard anytime
- Shared `src/logo.ts` module as single source of truth for ASCII banner

### Fixed
- Parallel subagent results no longer truncated at 200 characters

### Changed
- `wizard.ts` trimmed to env hydration only — onboarding logic moved to `onboarding.ts`
- First-launch banner removed from `loader.ts` (onboarding wizard handles branding)

## [2.3.10] - 2026-03-12

### Added
- Branded postinstall experience with animated spinners, progress indicators, and clean summary (#115)

### Fixed
- Ctrl+Alt shortcuts (dashboard, bg manager, voice) now show slash-command fallback in terminals that lack Kitty keyboard protocol support — macOS Terminal.app, JetBrains IDEs (#100, #104)

## [2.3.9] - 2026-03-12

### Added
- Tavily as alternative web search provider alongside Brave Search (#102)
- Auto-mode progress widget now shows all stats; footer hidden during auto-mode (#75)

### Fixed
- Auto-mode infinite loop and closeout instability — idempotent unit dispatch, retry caps, and atomic closeout (#96, #109)
- Migration no longer requires ROADMAP.md — milestones inferred from phases/ directory when missing (#93, #90)
- Worktree branch safety — proper namespacing and slice branch base selection (#92)
- Windows: use `execFile` to avoid single-quote shell issues (#103)
- Broken `read @GSD-WORKFLOW.md` references replaced with `/gsd` command (#88)
- Google Search extension updated to use `gemini-2.5-flash` (#83)
- Duplicate `getCurrentBranch` import in auto.ts (#87)
- `formatCost` crash on non-number cost values (#74)
- Avoid `sudo` prompts in postinstall script (#73)
- `.gsd/` folder removed from git tracking; consolidated `.gitignore` (#78)
- Multiple community-reported bugs across CLI, auto-mode, and extensions

## [2.3.8] - 2026-03-11

### Fixed
- Worktree file operations (Write, Read, Edit) now resolve paths against the active working directory instead of the launch directory (#72)
- Auto-mode merge guard handles all slice completion paths, preventing infinite dispatch loops when `complete-slice` is bypassed (#71)

## [2.3.7] - 2026-03-11

### Added
- Remote user questions via Slack/Discord for headless auto-mode sessions

### Fixed
- Auto-mode model switches no longer persist as the user's global default (#30)
- Auto-mode resume now rebuilds disk state and runs doctor before dispatching, preventing inline execution after pause (#16)
- Silent dispatch failure when command context is null now surfaces an error notification
- Race condition between timeout handlers and prompt dispatch in auto-mode
- Remote questions: validate IDs before test-send, sanitize error messages to prevent token leakage
- Remote questions: cap user_note at 500 chars to prevent LLM context injection
- Remote questions: validate channel ID format to prevent SSRF
- Remote questions: add 15s per-request fetch timeout to adapters
- Remote questions: distinguish Discord 404 from auth errors in reactions
- Prompt store sorting uses `updatedAt` instead of filename
- TypeScript parameter properties desugared for `--experimental-strip-types` compatibility

### Changed
- Remote question result details use discriminated union type

## [2.3.6] - 2026-03-11

### Fixed
- Postinstall no longer triggers hidden `sudo` prompt on Linux — Playwright's `--with-deps` flag is no longer run automatically, preventing `npm install -g` from appearing to hang (#67)
- Auto-commit dirty files before branch switch to prevent lost work during slice transitions

### Changed
- Updated README to reflect current commands, extensions, and step mode workflow

## [2.3.5] - 2026-03-11

### Fixed
- Voice extension: transcription no longer lost when pausing and resuming recording

## [2.3.4] - 2026-03-11

### Added
- CHANGELOG.md with curated history from v0.1.6 onwards
- Project-local `/publish-version` command for npm releases
- GitHub Sponsors funding configuration
- npm publish and install smoke test

## [0.3.3] - 2026-03-11

### Added
- `/gsd next` step mode — walk through units one at a time with a wizard between each
- `/gsd` bare command defaults to step mode
- `/exit` command to kill the GSD process immediately
- `/clear` as alias for `/new` (new session)
- MCPorter extension for lazy on-demand MCP server integration
- `/voice` extension for real-time speech-to-text
- Pi global install scripts
- Post-hook bookkeeping: auto-run doctor + rebuild STATE.md after each unit

### Changed
- Improved worktree merge, create, remove, and reload resilience
- Discuss prompt rewritten with reflection step and depth enforcement

### Fixed
- Idle watchdog false-firing on active agents — tasks >10min no longer get incorrectly skipped (#52)
- Browser screenshots constrained to 1568px max dimension (#56)
- Pi extensions loaded from `~/.pi/agent/extensions/` (#51)

### Removed
- `/gsd-run` command (replaced by `/gsd` and `/gsd next`)

## [0.3.1] - 2026-03-11

### Fixed
- Windows VT input restored after child processes exit (#41)
- Print/JSON mode in cli.js so subagents don't hang
- Discuss prompt loop prevention
- Managed tools bootstrap and gh auth
- Session list scoped to current working directory
- Bash/bg_shell hang and kill issues on Windows (#40)
- `/gsd-run` hardcoded `~/.pi/` path (#38)
- Windows backspace in masked input + custom browser path support (#36, #34)

### Changed
- Renamed "Get Stuff Done" to "Get Shit Done"

## [0.3.0] - 2026-03-11

### Added
- `/worktree` (`/wt`) — git worktree lifecycle management (#31)
- `/gsd migrate` — `.planning` to `.gsd` migration tool (#28)

### Fixed
- Skipped API keys now persist so wizard doesn't repeat on every launch (#27)
- Scoped models restored from settings on new session startup (#22)
- Startup fallback no longer overwrites user's default model with Sonnet (#29)

## [0.2.9] - 2026-03-11

### Fixed
- Idle recovery skips stuck units instead of silently stalling (#19)
- `pkg/package.json` version synced with pi-coding-agent to prevent false update banner
- Milestones with summary but no roadmap treated as complete (#13)

## [0.2.8] - 2026-03-11

### Added
- Mac-tools extension (macOS native automation)

## [0.2.6] - 2026-03-11

### Fixed
- Default model validated against full registry on every startup

## [0.2.5] - 2026-03-11

### Fixed
- Circular self-dependency removed, default model set to anthropic/claude-sonnet-4-6 with thinking off

## [0.2.4] - 2026-03-11

### Added
- Branded setup wizard UI with visual hierarchy, descriptions, and status feedback
- Branded banner on first launch
- Postinstall banner with version and next-step hint

### Fixed
- All `.pi/` paths updated to `.gsd/`
- Default model matching by `id.includes('sonnet')` for dated API IDs
- Circular gsd-pi self-dependency removed
- Pi SDK version check suppressed
- Selected options stay lit when notes field is focused

## [0.1.6] - 2026-03-11

### Added
- GitHub extension tool suite with confirmation gate
- Bundled skills: frontend-design, swiftui, debug-like-expert
- Skills trigger table in system prompt
- Resource loader syncs bundled skills to `~/.gsd/agent/skills/`

### Fixed
- `~/.gsd/agent/` paths in prompt templates instead of `~/.pi/agent/` (#10)
- Guard against re-injecting discuss prompt when session already in flight

### Changed
- License updated to MIT

[Unreleased]: https://github.com/gsd-build/gsd-2/compare/v2.73.1...HEAD
[2.73.1]: https://github.com/gsd-build/gsd-2/compare/v2.73.0...v2.73.1
[2.73.0]: https://github.com/gsd-build/gsd-2/compare/v2.72.0...v2.73.0
[2.72.0]: https://github.com/gsd-build/gsd-2/compare/v2.71.0...v2.72.0
[2.71.0]: https://github.com/gsd-build/gsd-2/compare/v2.70.1...v2.71.0
[2.70.1]: https://github.com/gsd-build/gsd-2/compare/v2.70.0...v2.70.1
[2.70.0]: https://github.com/gsd-build/gsd-2/compare/v2.69.0...v2.70.0
[2.69.0]: https://github.com/gsd-build/gsd-2/compare/v2.68.1...v2.69.0
[2.68.1]: https://github.com/gsd-build/gsd-2/compare/v2.68.0...v2.68.1
[2.68.0]: https://github.com/gsd-build/gsd-2/compare/v2.67.0...v2.68.0
[2.67.0]: https://github.com/gsd-build/gsd-2/compare/v2.66.1...v2.67.0
[2.66.1]: https://github.com/gsd-build/gsd-2/compare/v2.66.0...v2.66.1
[2.66.0]: https://github.com/gsd-build/gsd-2/compare/v2.65.0...v2.66.0
[2.65.0]: https://github.com/gsd-build/gsd-2/compare/v2.64.0...v2.65.0
[2.64.0]: https://github.com/gsd-build/gsd-2/compare/v2.63.0...v2.64.0
[2.63.0]: https://github.com/gsd-build/gsd-2/compare/v2.62.1...v2.63.0
[2.62.1]: https://github.com/gsd-build/gsd-2/compare/v2.62.0...v2.62.1
[2.62.0]: https://github.com/gsd-build/gsd-2/compare/v2.61.0...v2.62.0
[2.61.0]: https://github.com/gsd-build/gsd-2/compare/v2.60.0...v2.61.0
[2.60.0]: https://github.com/gsd-build/gsd-2/compare/v2.59.0...v2.60.0
[2.59.0]: https://github.com/gsd-build/gsd-2/compare/v2.58.0...v2.59.0
[2.58.0]: https://github.com/gsd-build/gsd-2/compare/v2.57.0...v2.58.0
[2.57.0]: https://github.com/gsd-build/gsd-2/compare/v2.56.0...v2.57.0
[2.56.0]: https://github.com/gsd-build/gsd-2/compare/v2.55.0...v2.56.0
[2.55.0]: https://github.com/gsd-build/gsd-2/compare/v2.54.0...v2.55.0
[2.54.0]: https://github.com/gsd-build/gsd-2/compare/v2.53.0...v2.54.0
[2.53.0]: https://github.com/gsd-build/gsd-2/compare/v2.52.0...v2.53.0
[2.52.0]: https://github.com/gsd-build/gsd-2/compare/v2.51.0...v2.52.0
[2.51.0]: https://github.com/gsd-build/gsd-2/compare/v2.50.0...v2.51.0
[2.50.0]: https://github.com/gsd-build/gsd-2/compare/v2.49.0...v2.50.0
[2.49.0]: https://github.com/gsd-build/gsd-2/compare/v2.48.0...v2.49.0
[2.48.0]: https://github.com/gsd-build/gsd-2/compare/v2.47.0...v2.48.0
[2.47.0]: https://github.com/gsd-build/gsd-2/compare/v2.46.1...v2.47.0
[2.46.1]: https://github.com/gsd-build/gsd-2/compare/v2.46.0...v2.46.1
[2.46.0]: https://github.com/gsd-build/gsd-2/compare/v2.45.0...v2.46.0
[2.45.0]: https://github.com/gsd-build/gsd-2/compare/v2.44.0...v2.45.0
[2.44.0]: https://github.com/gsd-build/gsd-2/compare/v2.43.0...v2.44.0
[2.43.0]: https://github.com/gsd-build/gsd-2/compare/v2.42.0...v2.43.0
[2.42.0]: https://github.com/gsd-build/gsd-2/compare/v2.41.0...v2.42.0
[2.41.0]: https://github.com/gsd-build/gsd-2/compare/v2.40.0...v2.41.0
[2.40.0]: https://github.com/gsd-build/gsd-2/compare/v2.39.0...v2.40.0
[2.39.0]: https://github.com/gsd-build/gsd-2/compare/v2.38.0...v2.39.0
[2.38.0]: https://github.com/gsd-build/gsd-2/compare/v2.37.1...v2.38.0
[2.37.1]: https://github.com/gsd-build/gsd-2/compare/v2.37.0...v2.37.1
[2.37.0]: https://github.com/gsd-build/gsd-2/compare/v2.36.0...v2.37.0
[2.36.0]: https://github.com/gsd-build/gsd-2/compare/v2.35.0...v2.36.0
[2.35.0]: https://github.com/gsd-build/gsd-2/compare/v2.34.0...v2.35.0
[2.34.0]: https://github.com/gsd-build/gsd-2/compare/v2.33.1...v2.34.0
[2.33.1]: https://github.com/gsd-build/gsd-2/compare/v2.33.0...v2.33.1
[2.33.0]: https://github.com/gsd-build/gsd-2/compare/v2.32.0...v2.33.0
[2.32.0]: https://github.com/gsd-build/gsd-2/compare/v2.31.2...v2.32.0
[2.31.2]: https://github.com/gsd-build/gsd-2/compare/v2.31.1...v2.31.2
[2.31.1]: https://github.com/gsd-build/gsd-2/compare/v2.31.0...v2.31.1
[2.31.0]: https://github.com/gsd-build/gsd-2/compare/v2.30.0...v2.31.0
[2.30.0]: https://github.com/gsd-build/gsd-2/compare/v2.29.0...v2.30.0
[2.29.0]: https://github.com/gsd-build/gsd-2/compare/v2.28.0...v2.29.0
[2.28.0]: https://github.com/gsd-build/gsd-2/compare/v2.27.0...v2.28.0
[2.27.0]: https://github.com/gsd-build/gsd-2/compare/v2.26.0...v2.27.0
[2.26.0]: https://github.com/gsd-build/gsd-2/compare/v2.25.0...v2.26.0
[2.25.0]: https://github.com/gsd-build/gsd-2/releases/tag/v2.25.0
[2.24.0]: https://github.com/gsd-build/gsd-2/compare/v2.23.0...v2.24.0
[2.23.0]: https://github.com/gsd-build/gsd-2/compare/v2.22.0...v2.23.0
[2.21.0]: https://github.com/gsd-build/gsd-2/compare/v2.20.0...v2.21.0
[2.19.0]: https://github.com/gsd-build/gsd-2/compare/v2.18.0...v2.19.0
[2.18.0]: https://github.com/gsd-build/gsd-2/compare/v2.17.0...v2.18.0
[2.17.0]: https://github.com/gsd-build/gsd-2/compare/v2.16.0...v2.17.0
[2.16.0]: https://github.com/gsd-build/gsd-2/compare/v2.15.1...v2.16.0
[2.15.1]: https://github.com/gsd-build/gsd-2/releases/tag/v2.15.1
[2.15.0]: https://github.com/gsd-build/gsd-2/compare/v2.14.4...v2.15.0
[2.14.4]: https://github.com/gsd-build/gsd-2/compare/v2.14.3...v2.14.4
[2.14.3]: https://github.com/gsd-build/gsd-2/compare/v2.14.2...v2.14.3
[2.14.2]: https://github.com/gsd-build/gsd-2/compare/v2.14.1...v2.14.2
[2.14.1]: https://github.com/gsd-build/gsd-2/compare/v2.14.0...v2.14.1
[2.14.0]: https://github.com/gsd-build/gsd-2/compare/v2.13.1...v2.14.0
[2.13.1]: https://github.com/gsd-build/gsd-2/compare/v2.13.0...v2.13.1
[2.13.0]: https://github.com/gsd-build/gsd-2/compare/v2.12.0...v2.13.0
[2.12.0]: https://github.com/gsd-build/gsd-2/compare/v2.11.1...v2.12.0
[2.11.1]: https://github.com/gsd-build/gsd-2/compare/v2.11.0...v2.11.1
[2.11.0]: https://github.com/gsd-build/gsd-2/compare/v2.10.12...v2.11.0
[2.10.12]: https://github.com/gsd-build/gsd-2/compare/v2.10.11...v2.10.12
[2.10.11]: https://github.com/gsd-build/gsd-2/compare/v2.10.10...v2.10.11
[2.10.10]: https://github.com/gsd-build/gsd-2/compare/v2.10.9...v2.10.10
[2.10.9]: https://github.com/gsd-build/gsd-2/compare/v2.10.8...v2.10.9
[2.10.8]: https://github.com/gsd-build/gsd-2/compare/v2.10.7...v2.10.8
[2.10.7]: https://github.com/gsd-build/gsd-2/compare/v2.10.6...v2.10.7
[2.10.6]: https://github.com/gsd-build/gsd-2/compare/v2.10.5...v2.10.6
[2.10.5]: https://github.com/gsd-build/gsd-2/compare/v2.10.4...v2.10.5
[2.10.4]: https://github.com/gsd-build/gsd-2/compare/v2.10.2...v2.10.4
[2.10.2]: https://github.com/gsd-build/gsd-2/compare/v2.10.1...v2.10.2
[2.10.1]: https://github.com/gsd-build/gsd-2/compare/v2.10.0...v2.10.1
[2.10.0]: https://github.com/gsd-build/gsd-2/compare/v2.9.0...v2.10.0
[2.9.0]: https://github.com/gsd-build/gsd-2/compare/v2.8.3...v2.9.0
[2.8.3]: https://github.com/gsd-build/gsd-2/compare/v2.8.2...v2.8.3
[2.8.2]: https://github.com/gsd-build/gsd-2/compare/v2.8.1...v2.8.2
[2.8.1]: https://github.com/gsd-build/gsd-2/compare/v2.8.0...v2.8.1
[2.8.0]: https://github.com/gsd-build/gsd-2/compare/v2.7.1...v2.8.0
[2.7.1]: https://github.com/gsd-build/gsd-2/compare/v2.7.0...v2.7.1
[2.7.0]: https://github.com/gsd-build/gsd-2/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/gsd-build/gsd-2/compare/v2.5.1...v2.6.0
[2.20.0]: https://github.com/gsd-build/gsd-2/releases/tag/v2.20.0
[2.22.0]: https://github.com/gsd-build/gsd-2/releases/tag/v2.22.0
[2.5.1]: https://github.com/gsd-build/gsd-2/compare/v2.5.0...v2.5.1
[2.5.0]: https://github.com/gsd-build/gsd-2/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/gsd-build/gsd-2/compare/v2.3.11...v2.4.0
[2.3.11]: https://github.com/gsd-build/gsd-2/compare/v2.3.10...v2.3.11
[2.3.10]: https://github.com/gsd-build/gsd-2/compare/v2.3.9...v2.3.10
[2.3.9]: https://github.com/gsd-build/gsd-2/compare/v2.3.8...v2.3.9
[2.3.8]: https://github.com/gsd-build/gsd-2/compare/v2.3.7...v2.3.8
[2.3.7]: https://github.com/gsd-build/gsd-2/compare/v2.3.6...v2.3.7
[2.3.6]: https://github.com/gsd-build/gsd-2/compare/v2.3.5...v2.3.6
[2.3.5]: https://github.com/gsd-build/gsd-2/compare/v2.3.4...v2.3.5
[2.3.4]: https://github.com/gsd-build/gsd-2/compare/v0.3.3...v2.3.4
[0.3.3]: https://github.com/gsd-build/gsd-2/compare/v0.3.1...v0.3.3
[0.3.1]: https://github.com/gsd-build/gsd-2/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/gsd-build/gsd-2/compare/v0.2.9...v0.3.0
[0.2.9]: https://github.com/gsd-build/gsd-2/compare/v0.2.8...v0.2.9
[0.2.8]: https://github.com/gsd-build/gsd-2/compare/v0.2.6...v0.2.8
[0.2.6]: https://github.com/gsd-build/gsd-2/compare/v0.2.5...v0.2.6
[0.2.5]: https://github.com/gsd-build/gsd-2/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/gsd-build/gsd-2/compare/v0.1.6...v0.2.4
[0.1.6]: https://github.com/gsd-build/gsd-2/releases/tag/v0.1.6
