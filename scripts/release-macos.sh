#!/usr/bin/env bash

set -euo pipefail

readonly PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
readonly NOTARY_PROFILE="${NOTARY_KEYCHAIN_PROFILE:-afro-meet-notary}"
readonly SIGNING_IDENTITY="Developer ID Application: Afro SpA (979UYPA9L5)"

if [[ -d /opt/homebrew/opt/node@24/bin ]]; then
    export PATH="/opt/homebrew/opt/node@24/bin:${PATH}"
fi

cd "${PROJECT_DIR}"

readonly NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
readonly APP_VERSION="$(node -p 'require("./package.json").version')"
readonly DMG_PATH="${PROJECT_DIR}/dist/afro-meet-${APP_VERSION}.dmg"
readonly APP_PATH="${PROJECT_DIR}/dist/mac-universal/Afro Meet.app"

if (( NODE_MAJOR < 24 )); then
    echo "Afro Meet requiere Node.js 24 o posterior; se encontró $(node --version)." >&2
    exit 1
fi

if ! security find-identity -v -p codesigning | grep -Fq "${SIGNING_IDENTITY}"; then
    echo "No se encontró la identidad de firma: ${SIGNING_IDENTITY}" >&2
    exit 1
fi

if ! xcrun notarytool history --keychain-profile "${NOTARY_PROFILE}" >/dev/null; then
    echo "No se pudieron validar las credenciales del perfil: ${NOTARY_PROFILE}" >&2
    exit 1
fi

npm run dist:mac

if [[ ! -d "${APP_PATH}" || ! -f "${DMG_PATH}" ]]; then
    echo "No se generó el instalador esperado: ${DMG_PATH}" >&2
    exit 1
fi

codesign --verify --deep --strict --verbose=2 "${APP_PATH}"

xcrun notarytool submit "${DMG_PATH}" \
    --keychain-profile "${NOTARY_PROFILE}" \
    --wait
xcrun stapler staple "${DMG_PATH}"
xcrun stapler validate "${DMG_PATH}"
node ./scripts/update-mac-manifest.js

(
    cd "$(dirname "${DMG_PATH}")"
    shasum -a 256 "$(basename "${DMG_PATH}")" > "$(basename "${DMG_PATH}").sha256"
)

echo "Instalador firmado y notarizado: ${DMG_PATH}"
