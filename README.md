# Afro Meet Desktop 2.0.5

Cliente de escritorio de Afro Meet para macOS, Windows y Linux. Esta versión se basa en el cliente moderno de Jitsi Meet Electron y abre `https://meet.afro.cl` de forma predeterminada.

## Requisitos

- Node.js 24 y npm.
- En macOS: Xcode Command Line Tools.
- Para publicar en macOS: la identidad `Developer ID Application: Afro SpA (979UYPA9L5)` y el perfil de notaría `afro-meet-notary` guardados en el llavero.

## Desarrollo

Si usas nvm, ejecuta `nvm use` para seleccionar la versión indicada en `.nvmrc`.

```bash
npm ci
npm start
```

Comprobaciones antes de publicar:

```bash
npm run lint
npm run type-check
npm run build
```

## Instalador de macOS

El comando de publicación compila una aplicación universal para Apple Silicon e Intel, la firma, envía el DMG a Apple para notarización y adjunta el ticket aprobado:

```bash
npm run release:mac
```

El resultado final queda en `dist/afro-meet-2.0.5.dmg`, acompañado por su archivo SHA-256. Para usar otro perfil de llavero:

```bash
NOTARY_KEYCHAIN_PROFILE=otro-perfil npm run release:mac
```

## Instalador de Windows

```bash
npm run dist:win
```

Genera el instalador NSIS x64 en `dist/`, junto con `latest.yml` y el archivo `.blockmap`.

## Personalización

- Nombre: Afro Meet
- Identificador: `cl.afro.meetmac`
- Servidor predeterminado: `https://meet.afro.cl`
- Enlaces profundos: `afro-meet://nombre-de-sala`
- Actualizaciones: `https://www.afromeet.cl/desktop/updates/`
- Configuración de marca: `app/features/config/index.ts`
- Iconos: `resources/icon.icns` y `resources/icon.png`

## Licencia y atribución

Basado en [Jitsi Meet Electron](https://github.com/jitsi/jitsi-meet-electron), distribuido bajo Apache License 2.0. Consulta `LICENSE`.
