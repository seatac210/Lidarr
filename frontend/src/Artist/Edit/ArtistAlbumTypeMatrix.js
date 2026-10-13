import PropTypes from 'prop-types';
import React from 'react';
import CheckInput from 'Components/Form/CheckInput';
import FormGroup from 'Components/Form/FormGroup';
import FormLabel from 'Components/Form/FormLabel';
import translate from 'Utilities/String/translate';

const PRIMARY_TYPES = [
  { id: 0, name: 'Album' },
  { id: 1, name: 'EP' },
  { id: 2, name: 'Single' },
  { id: 3, name: 'Broadcast' },
  { id: 4, name: 'Other' }
];

const SECONDARY_TYPES = [
  { id: 0, name: 'Studio' },
  { id: 1, name: 'Compilation' },
  { id: 2, name: 'Soundtrack' },
  { id: 3, name: 'Spokenword' },
  { id: 4, name: 'Interview' },
  { id: 5, name: 'Audiobook' },
  { id: 6, name: 'Live' },
  { id: 7, name: 'Remix' },
  { id: 8, name: 'DJ-mix' },
  { id: 9, name: 'Mixtape/Street' },
  { id: 10, name: 'Demo' },
  { id: 11, name: 'Audio drama' }
];

const RELEASE_STATUSES = [
  { id: 0, name: 'Official' },
  { id: 1, name: 'Promotion' },
  { id: 2, name: 'Bootleg' },
  { id: 3, name: 'Pseudo-Release' }
];

// The album categories most relevant to a personal music library, mapped to
// the underlying MusicBrainz secondary type id.
const MAIN_CATEGORIES = [
  { id: 0, label: 'Studio Albums' }, // Studio
  { id: 1, label: 'Greatest Hits' }, // Compilation
  { id: 6, label: 'Live Albums' } // Live
];

const MAIN_CATEGORY_IDS = MAIN_CATEGORIES.map((c) => c.id);
const OTHER_SECONDARY_TYPES = SECONDARY_TYPES.filter((t) => !MAIN_CATEGORY_IDS.includes(t.id));

function getAllowedById(items, typeKey) {
  const map = {};
  (items || []).forEach((item) => {
    const type = item[typeKey];
    if (type) {
      map[type.id] = !!item.allowed;
    }
  });
  return map;
}

function CheckRow({ label, checked, name, onToggle }) {
  return (
    <label
      style={{ display: 'inline-flex', alignItems: 'center', marginRight: 16 }}
    >
      <CheckInput
        name={name}
        value={checked}
        onChange={({ value }) => onToggle(value)}
      />
      <span style={{ marginLeft: 4 }}>{label}</span>
    </label>
  );
}

CheckRow.propTypes = {
  label: PropTypes.string.isRequired,
  checked: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  onToggle: PropTypes.func.isRequired
};

function ArtistAlbumTypeMatrix(props) {
  const {
    primaryAlbumTypeOverrides,
    secondaryAlbumTypeOverrides,
    releaseStatusOverrides,
    defaultPrimaryIds,
    defaultSecondaryIds,
    defaultReleaseIds,
    onItemsChange
  } = props;

  const hasSecondary = !!(secondaryAlbumTypeOverrides && secondaryAlbumTypeOverrides.length);
  const hasPrimary = !!(primaryAlbumTypeOverrides && primaryAlbumTypeOverrides.length);
  const hasRelease = !!(releaseStatusOverrides && releaseStatusOverrides.length);

  const secondaryAllowed = (typeId) => {
    if (hasSecondary) {
      return !!getAllowedById(secondaryAlbumTypeOverrides, 'secondaryAlbumType')[typeId];
    }
    return defaultSecondaryIds.includes(typeId);
  };

  const primaryAllowed = (typeId) => {
    if (hasPrimary) {
      return !!getAllowedById(primaryAlbumTypeOverrides, 'primaryAlbumType')[typeId];
    }
    return defaultPrimaryIds.includes(typeId);
  };

  const releaseAllowed = (typeId) => {
    if (hasRelease) {
      return !!getAllowedById(releaseStatusOverrides, 'releaseStatus')[typeId];
    }
    return defaultReleaseIds.includes(typeId);
  };

  const toggleSecondary = (typeId, value) => {
    const allowed = getAllowedById(secondaryAlbumTypeOverrides, 'secondaryAlbumType');
    const newList = SECONDARY_TYPES.map((t) => {
      const fallback = hasSecondary ? !!allowed[t.id] : defaultSecondaryIds.includes(t.id);
      const allow = t.id === typeId ? value : fallback;
      return { secondaryAlbumType: { id: t.id, name: t.name }, allowed: allow };
    });
    onItemsChange('secondaryAlbumTypeOverrides', newList);
  };

  const togglePrimary = (typeId, value) => {
    const allowed = getAllowedById(primaryAlbumTypeOverrides, 'primaryAlbumType');
    const newList = PRIMARY_TYPES.map((t) => {
      const fallback = hasPrimary ? !!allowed[t.id] : defaultPrimaryIds.includes(t.id);
      const allow = t.id === typeId ? value : fallback;
      return { primaryAlbumType: { id: t.id, name: t.name }, allowed: allow };
    });
    onItemsChange('primaryAlbumTypeOverrides', newList);
  };

  const toggleRelease = (typeId, value) => {
    const allowed = getAllowedById(releaseStatusOverrides, 'releaseStatus');
    const newList = RELEASE_STATUSES.map((t) => {
      const fallback = hasRelease ? !!allowed[t.id] : defaultReleaseIds.includes(t.id);
      const allow = t.id === typeId ? value : fallback;
      return { releaseStatus: { id: t.id, name: t.name }, allowed: allow };
    });
    onItemsChange('releaseStatusOverrides', newList);
  };

  return (
    <div>
      <FormGroup>
        <FormLabel>
          Album Categories
        </FormLabel>
        <div>
          {MAIN_CATEGORIES.map((cat) => (
            <CheckRow
              key={cat.id}
              label={cat.label}
              name={cat.label}
              checked={secondaryAllowed(cat.id)}
              onToggle={(value) => toggleSecondary(cat.id, value)}
            />
          ))}
        </div>
      </FormGroup>

      <details style={{ marginTop: 8 }}>
        <summary style={{ cursor: 'pointer', fontWeight: 500, marginBottom: 4 }}>
          Other album types
        </summary>

        <FormGroup>
          <FormLabel>{translate('SecondaryAlbumTypes')}</FormLabel>
          <div>
            {OTHER_SECONDARY_TYPES.map((type) => (
              <CheckRow
                key={type.id}
                label={type.name}
                name={`secondary_${type.name}`}
                checked={secondaryAllowed(type.id)}
                onToggle={(value) => toggleSecondary(type.id, value)}
              />
            ))}
          </div>
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('PrimaryAlbumTypes')}</FormLabel>
          <div>
            {PRIMARY_TYPES.map((type) => (
              <CheckRow
                key={type.id}
                label={type.name}
                name={`primary_${type.name}`}
                checked={primaryAllowed(type.id)}
                onToggle={(value) => togglePrimary(type.id, value)}
              />
            ))}
          </div>
        </FormGroup>

        <FormGroup>
          <FormLabel>{translate('ReleaseStatuses')}</FormLabel>
          <div>
            {RELEASE_STATUSES.map((type) => (
              <CheckRow
                key={type.id}
                label={type.name}
                name={`release_${type.name}`}
                checked={releaseAllowed(type.id)}
                onToggle={(value) => toggleRelease(type.id, value)}
              />
            ))}
          </div>
        </FormGroup>
      </details>
    </div>
  );
}

ArtistAlbumTypeMatrix.propTypes = {
  primaryAlbumTypeOverrides: PropTypes.arrayOf(PropTypes.object),
  secondaryAlbumTypeOverrides: PropTypes.arrayOf(PropTypes.object),
  releaseStatusOverrides: PropTypes.arrayOf(PropTypes.object),
  defaultPrimaryIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultSecondaryIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  defaultReleaseIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onItemsChange: PropTypes.func.isRequired
};

export default ArtistAlbumTypeMatrix;
