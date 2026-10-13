using FluentMigrator;
using NzbDrone.Core.Datastore.Migration.Framework;

namespace NzbDrone.Core.Datastore.Migration
{
    [Migration(082)]
    public class add_artist_album_type_overrides : NzbDroneMigrationBase
    {
        protected override void MainDbUpgrade()
        {
            Alter.Table("Artists").AddColumn("PrimaryAlbumTypeOverrides").AsString().Nullable();
            Alter.Table("Artists").AddColumn("SecondaryAlbumTypeOverrides").AsString().Nullable();
            Alter.Table("Artists").AddColumn("ReleaseStatusOverrides").AsString().Nullable();
        }
    }
}
