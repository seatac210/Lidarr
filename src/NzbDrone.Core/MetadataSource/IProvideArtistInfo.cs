using System;
using System.Collections.Generic;
using NzbDrone.Core.Music;
using NzbDrone.Core.Profiles.Metadata;

namespace NzbDrone.Core.MetadataSource
{
    public interface IProvideArtistInfo
    {
        Artist GetArtistInfo(string lidarrId, int metadataProfileId, List<ProfilePrimaryAlbumTypeItem> primaryOverrides = null, List<ProfileSecondaryAlbumTypeItem> secondaryOverrides = null, List<ProfileReleaseStatusItem> releaseOverrides = null);
        HashSet<string> GetChangedArtists(DateTime startTime);
    }
}
