# Plan de Migración — app-dores → Supabase multi-sucursal (`dwqazgdifwswqrtzvhoa`)

> **Objetivo:** migrar la capa Supabase de app-dores del proyecto viejo caído
> (`yjpcnxhtrucncqdzoyxy`, esquema mono-comercio) al proyecto vivo
> (`dwqazgdifwswqrtzvhoa`, esquema multi-sucursal que usa `dores-admin`).
>
> **Estado:** propuesta. No implementado. Verificado contra la base viva por MCP el 2026-07-22.
> Contrato del ecosistema: [`../dores-admin/docs/SHARED-DATA-CONTRACT.md`](../dores-admin/docs/SHARED-DATA-CONTRACT.md).
> Esquema completo: `../dores-admin/docs/DATABASE.md`.

---

## 1. Por qué no es un simple cambio de URL

La app habla un esquema que **ya no existe**. Cambios de fondo entre viejo → nuevo:

| Concepto | Viejo (lo que habla la app hoy) | Nuevo (base viva) |
|---|---|---|
| Tenant | `commerce_id` → `commerce_profiles` | `branch_id` → `branches` |
| IDs | La app los trata como **números** (`Number(db.id)`) | **UUID** (`Number(uuid)` = `NaN`) 🔴 |
| Catálogo | `products.commerce_id`, `products.price`, `stock` bool | `products` global + `branch_products` (`price_override`, `is_available`) |
| Imágenes producto | tabla `product_images` (n por producto) | columna única `products.image_url` |
| Categorías | `categories.icon` | `categories.image_url`, `slug`, `branch_id` |
| Extras del ítem | `drink_addons` + `observations` (jsonb) | **modificadores**: `modifier_groups`/`options`/`product_modifier_groups` + `order_item_modifiers`; nota libre en `order_items.notes` |
| Estados pedido | `PEDIDO_EN_PROCESO…` (español) | enum `pending/confirmed/preparing/ready/delivering/delivered/cancelled` |
| Tipo pedido | `DELIVERY`/`IN_STORE` | enum `delivery`/`pickup` |
| Pago | columnas en `orders` (`payment_method`, `payment_reference`, `payment_status`) | tabla **`payments`** aparte (`method_id`, `status`, `reference`, `amount`, `currency`) |
| Cliente | `customer_first_name`/`last_name` | `customer_name` (uno) + `user_id` (Supabase Auth) |
| Dirección | `delivery_address` texto | `delivery_address_id`→`addresses`, o `delivery_address_text` + `delivery_lat/lng` |
| Multimoneda | `total_bs`, `exchange_rate` | `total_ves`, `exchange_rate` (+ `subtotal`) |
| Notif. al admin | la app INSERTA `notifications` (`NEW_ORDER`) | **la generan triggers**; la app NO inserta |
| Origen | — | `orders.source_channel` (marca que el pedido vino de la app) |

🔴 **El mayor riesgo transversal:** las entidades del dominio y los mappers asumen `id: number`
(`domain/entities/*`, `domain/mappers/supabaseMappers.ts`). Todo el modelo debe pasar a `string`
(UUID). Esto toca entidades, mappers, componentes y navegación por params.

---

## 2. Archivos impactados (capa Supabase actual)

- `infrastructure/supabase/config.ts` — URL + anon key del proyecto (→ nuevo, vía env).
- `domain/services/orderService.ts` — `createOrder`, `getAllOrders`, `getOrderById`, `cancelOrder`.
- `domain/services/supabase/checkoutDataService.ts` — payment_methods, exchange_rates, delivery_zones, drink_addons.
- `domain/services/supabase/commerceService.ts` — `getCommerceId()` (desaparece el concepto).
- `domain/services/menuService.ts` — `products` (+ join `product_images`).
- `domain/services/categoryService.ts` — `categories`.
- `domain/services/bannerService.ts` — `daily_promotions` → `banners`.
- `domain/mappers/supabaseMappers.ts` — todos los mappers (IDs, campos, estados).
- `domain/entities/supabaseTypes.ts` + entidades (`orderEntity`, `menuEntity`, `categoryEntity`, …) — tipos e IDs.
- `utils/helpers.ts`, `presentation/screens/{orderList,orderDetail}.tsx` — estados `PEDIDO_*` hardcodeados.

---

## 3. Decisiones abiertas (bloquean el diseño — a definir contigo)

1. **Sucursal:** la app era mono-comercio. ¿Ahora hay selector de sucursal, o se fija una
   `branch_id` por defecto? Todo el catálogo/checkout depende de esto.
2. **Auth:** hoy la app autentica por la API REST (`dores.cruznegradev.com`) con JWT propio. El
   esquema nuevo asume **Supabase Auth** (`orders.user_id`, `profiles`, `addresses`, RLS por `auth.uid()`).
   ¿Migramos auth a Supabase, o mantenemos REST y mapeamos usuarios? Define el alcance real.
3. **Alcance dual-backend:** ¿este es el momento de mover TODO a Supabase y jubilar la API REST, o
   solo re-apuntar la parte que ya usaba Supabase?
4. **RLS de cliente:** confirmar/crear políticas para el rol `anon`/`authenticated` de cliente
   (lectura de catálogo, INSERT de `orders`/`order_items`/`payments` propios). Coordinar con `dores-admin`.
5. **Datos viejos:** ¿hay que rescatar algo del proyecto caído (`yjpcnxhtrucncqdzoyxy`) si aún se
   puede despausar? Pedidos históricos, etc.

---

## 4. Fases propuestas

**Fase 0 — Preparación (sin tocar la app)**
- Confirmar decisiones de la sección 3.
- Generar tipos TS del esquema vivo (`supabase gen types` / MCP `generate_typescript_types`) como base.
- Crear/validar políticas RLS de cliente en un **branch de Supabase** (`create_branch`) para no tocar prod.

**Fase 1 — Fundaciones**
- Nuevo `config.ts` con `EXPO_PUBLIC_SUPABASE_URL`/`ANON_KEY` apuntando a `dwqazgdifwswqrtzvhoa`.
- Migrar IDs de dominio `number → string (UUID)` en entidades y mappers (cambio ancho, hacerlo primero).
- Introducir `branch_id` (selector o default) en el estado global (Cart/Order context).

**Fase 2 — Lectura (catálogo)**
- `categoryService`, `menuService`, `bannerService` → tablas nuevas (`categories`, `products` +
  `branch_products`, `banners`), imágenes por `image_url`.
- Reescribir mappers de producto/categoría/banner.

**Fase 3 — Checkout y pedidos (lo más delicado)**
- `checkoutDataService` → `payment_methods` (global), `exchange_rates` (una por día), `delivery_zones` (por `branch_id`).
- Reemplazar `drink_addons` por **modificadores** (grupos/opciones por producto) en carrito y UI.
- `orderService.createOrder` → INSERT `orders` (`status='pending'`, `user_id`, `branch_id`,
  `source_channel`) + `order_items` (con `product_name`/`category_name` snapshot) +
  `order_item_modifiers` + `payments`. **Quitar** el INSERT manual de `notifications`.
- `getAllOrders` → filtrar por `user_id` (no `commerce_id`); tracking por Realtime de `orders`/`order_status_history`.
- Remapear estados a los enums en inglés (y actualizar `utils/helpers.ts` y pantallas de orden).

**Fase 4 — Verificación**
- Prueba end-to-end contra un **branch** de Supabase: crear pedido desde la app → verlo en `dores-admin`.
- Validar Realtime, multimoneda (`total_ves`), y que el admin puede avanzar el estado.
- Recién entonces, apuntar a producción.

---

## 5. Riesgos

- **IDs numéricos → UUID**: rompe tipos en cascada; es el cambio con más superficie.
- **Modificadores**: no es un rename de `drink_addons`; es un modelo nuevo con UI propia.
- **Auth**: si se migra a Supabase Auth, cambia el flujo de login/registro completo y el RLS.
- **Doble esquema en el código**: mientras dure la migración, evitar dejar servicios a medias que
  mezclen tablas viejas/nuevas.
- **Producción compartida**: `dores-admin` opera a diario sobre esa base — trabajar en branch y
  coordinar cambios de RLS/DDL.
