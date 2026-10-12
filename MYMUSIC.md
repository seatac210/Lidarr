# Lidarr (seatac210 fork) — personal music control

This is a fork of [Lidarr/Lidarr](https://github.com/Lidarr/Lidarr) customized for Bryan's
music goals. The goal is fine-grained control over *what* is pulled from your sources and
*what* files are accepted.

## What this fork changes

### 1. Default "Studio + Greatest Hits" profile
The default `Standard` metadata profile now allows:

- Primary type: `Album`
- Secondary types: `Studio` **and** `Compilation` (greatest hits)
- Release status: `Official`

So a fresh install pulls full studio albums and greatest-hits/compilation albums only, by default.

### 2. Per-artist album type overrides
Each artist can now be given its own set of allowed album types, selected individually
(primary type, secondary type, release status), without juggling metadata profiles in
Settings. Overrides are stored directly on the artist and are enforced upstream of the
music-sourcing metadata (SkyHook) — the same filtering point that decides what gets added.

Mechanically:

- New columns on `Artists`: `PrimaryAlbumTypeOverrides`, `SecondaryAlbumTypeOverrides`,
  `ReleaseStatusOverrides` (migration `082`).
- `SkyHookProxy.FilterAlbums` / `GetArtistInfo` and `IProvideArtistInfo` accept per-artist
  overrides that supersede the metadata profile; `RefreshArtistService` and `AddArtistService`
  pass the artist's overrides through.
- `ArtistResource` carries the three override lists so they round-trip through the artist
  save endpoint.

### 3. File types
Control of downloaded file types is handled by the existing **Quality Profiles** (codec,
container, bitrate) plus **Custom Formats**. Use those to require FLAC/lossless and exclude
MP3/AAC/etc. No code change was needed here — it's configuration.

## Build & test

Backend (.NET 8):

```sh
export DOTNET_ROOT="$HOME/.dotnet"; export PATH="$DOTNET_ROOT:$PATH"
dotnet build src/NzbDrone.Core/Lidarr.Core.csproj -p:EnableAnalyzers=false
dotnet test src/NzbDrone.Core.Test/Lidarr.Core.Test.csproj \
  -p:EnableAnalyzers=false --filter "FullyQualifiedName~SkyHookProxyFixture"
```

Note: `EnableAnalyzers=false` bypasses StyleCop's SA1200 which the local build otherwise
treats as errors (the project gate in `Directory.Build.props`).

## Status
- Backend override mechanism: implemented, builds, unit-tested.
- Frontend per-artist album-type matrix in the artist editor: pending.
