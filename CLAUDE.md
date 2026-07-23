# CLAUDE.md — app-dores

App móvil del **cliente** para el ecosistema de delivery **Dore's** (Venezuela). Los clientes
navegan el catálogo, arman el carrito y crean pedidos que el panel `dores-admin` gestiona.

> Parte de un workspace de 3 repos hermanos (`app-dores`, `dores-admin`, `bancamiga-dores`).
> **Está pensada para compartir base Supabase con `dores-admin`, pero hoy NO lo hace**: apunta a un
> proyecto caído y le falta migrar al esquema multi-sucursal vivo (ver sección crítica abajo). Lee
> el contrato: [`../dores-admin/docs/SHARED-DATA-CONTRACT.md`](../dores-admin/docs/SHARED-DATA-CONTRACT.md)
> (asume los repos clonados como carpetas hermanas).

## Stack

- **React Native + Expo 52** (`newArchEnabled`), iOS/Android + web (`react-native-web`).
- TypeScript `strict`, React 18, React Navigation v7.
- **NativeWind** (Tailwind para RN) — estilos con `className`.
- `react-hook-form` + `zod`, `@rneui/base`, `lucide-react-native`, `react-native-maps`, `expo-location`, `expo-notifications`.

## Gestor de paquetes y comandos

**Usa `bun`** (hay `bun.lock`; `cesconfig.json` fija `bun 1.2.3`). No uses npm aunque exista un
`package-lock.json` heredado.

```bash
bun install
bun start          # expo start
bun run android    # expo run:android
bun run ios        # expo run:ios
bun run web        # expo start --web
bun run lint       # eslint + prettier -c
bun run format     # eslint --fix + prettier --write
```

No hay tests. Builds de distribución vía **EAS** (`eas.json`: perfiles development / preview(APK) / production).

## Arquitectura (Clean Architecture, alias `~/`)

- `domain/` — lógica pura: `entities/`, `repositories/` (interfaces), `services/` (casos de uso, incl. `services/supabase/`), `mappers/`, `sources/remote/apiClient.ts`.
- `data/` — implementaciones de repositorios + `schemas/` (Zod).
- `infrastructure/` — `supabase/` (client, config, imageHelper), `http/` (apiService, authInterceptor), `storage/` (AsyncStorage).
- `presentation/` — `screens/`, `components/`, `context/` (Cart, User, Order, Notification, Push, Address), `hooks/`, `viewmodels/`.
- `navigation/` — `root.tsx` + `navigationService` (navegación imperativa).
- Entrada: `App.tsx` monta el árbol de providers dentro de un `ErrorBoundary`.

## Backends (⚠️ la app es DUAL-BACKEND, en transición)

1. **API REST propia** — `https://dores.cruznegradev.com/api` (hardcodeada en `domain/sources/remote/apiClient.ts` e `infrastructure/http/apiService.ts`, dos clientes casi duplicados). Auth Bearer JWT con refresh en 401 (`infrastructure/http/authInterceptor.ts`). Cubre auth, menús, comercios, categorías, órdenes.
2. **Supabase** — comercios/checkout, creación de pedidos e imágenes de Storage. Config en `infrastructure/supabase/config.ts`.

Al trabajar con pedidos/checkout, revisa si el flujo va por REST o por Supabase antes de editar.

## 🔴 Estado crítico de Supabase — MIGRACIÓN PENDIENTE

- `infrastructure/supabase/config.ts` apunta al proyecto **`yjpcnxhtrucncqdzoyxy`**, que está
  **CAÍDO** (no resuelve; eliminado o pausado). **Verificado por MCP el 2026-07-22.** Es decir, hoy
  toda la capa Supabase de la app (checkout, comercios, menús-por-Supabase, creación de pedidos,
  banners) está **rota** contra ese proyecto.
- El proyecto **vivo** del ecosistema es **`dwqazgdifwswqrtzvhoa`** (lo usa `dores-admin`), con un
  esquema **multi-sucursal** totalmente distinto al que habla esta app (usa `branch_id`, estados en
  inglés `pending/confirmed/…`, catálogo global + `branch_products`, modificadores en vez de
  `drink_addons`, `payments` aparte). Esta app aún habla el esquema **viejo** (`commerce_id`,
  `PEDIDO_*`, `commerce_profiles`, `daily_promotions`, `drink_addons`, IDs numéricos).
- **Migrar NO es cambiar la URL**: es refactorizar la capa de datos (incl. IDs numéricos → UUID).
  Plan completo: [`MIGRATION-PLAN.md`](./MIGRATION-PLAN.md).
- Contrato del ecosistema: [`../dores-admin/docs/SHARED-DATA-CONTRACT.md`](../dores-admin/docs/SHARED-DATA-CONTRACT.md).

## Seguridad — deuda conocida

- `SUPABASE_URL` y `ANON_KEY` están **hardcodeadas** en `infrastructure/supabase/config.ts` (no en
  `.env` / `EXPO_PUBLIC_*`). La `anon_key` es pública, pero conviene moverla a variables de entorno.
- No hay `.env` versionado (`.env**` está en `.gitignore`).

## Convenciones

- Sigue la arquitectura por capas: la UI no llama a Supabase/HTTP directo — pasa por `services` →
  `repositories`. Mapea filas de DB a entidades en `domain/mappers/`.
- Estilos con NativeWind (`className`), tema en `presentation/styles/theme`.
- Fuentes: ver `FONT_USAGE.md`. Mejoras UX documentadas en `CATEGORY_UX_IMPROVEMENTS.md`, `UX_UI_IMPROVEMENTS.md`.
