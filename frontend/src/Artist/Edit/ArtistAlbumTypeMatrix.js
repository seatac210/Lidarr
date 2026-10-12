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

function TypeGroup({ label, helpText, types, items, typeKey, defaultAllowedIds, onItemsChange }) {
  // Build a map of type id -> allowed from the artist's override items (if present).
  const allowedById = {};
  if (items && items.length) {
    items.forEach((item) => {
      const type = item[typeKey];
      if (type) {
        allowedById[type.id] = !!item.allowed;
      }
    });
  }

  const isAllowed = (type) => {
    if (items && items.length) {
      return !!allowedById[type.id];
    }
    return defaultAllowedIds.includes(type.id);
  };

  const onToggle = (type, value) => {
    const newItems = types.map((t) => ({
      [typeKey]: { id: t.id, name: t.name },
      allowed: t.id === type.id ? value : isAllowed(t)
    }));
    onItemsChange(newItems);
  };

  return (
    <FormGroup>
      <FormLabel>
        {label}
        {helpText ? <span style={{ fontWeight: 400 }}>{helpText}</span> : null}
      </FormLabel>
      <div>
        {types.map((type) => (
          <label
            key={type.id}
            style={{ display: 'inline-flex', alignItems: 'center', marginRight: 16 }}
          >
            <CheckInput
              name={type.name}
              value={isAllowed(type)}
              onChange={({ value }) => onToggle(type, value)}
            />
            <span style={{ marginLeft: 4 }}>{type.name}</span>
          </label>
        ))}
      </div>
    </FormGroup>
  );
}

TypeGroup.propTypes = {
  label: PropTypes.string.isRequired,
  helpText: PropTypes.string,
  types: PropTypes.arrayOf(PropTypes.object).isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  typeKey: PropTypes.string.isRequired,
  defaultAllowedIds: PropTypes.arrayOf(PropTypes.number).isRequired,
  onItemsChange: PropTypes.func.isRequired
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

  return (
    <div>
      <TypeGroup
        label={translate('PrimaryAlbumTypes')}
        types={PRIMARY_TYPES}
        items={primaryAlbumTypeOverrides}
        typeKey="primaryAlbumType"
        defaultAllowedIds={defaultPrimaryIds}
        onItemsChange={(items) => onItemsChange('primaryAlbumTypeOverrides', items)}
      />
      <TypeGroup
        label={translate('SecondaryAlbumTypes')}
        types={SECONDARY_TYPES}
        items={secondaryAlbumTypeOverrides}
        typeKey="secondaryAlbumType"
        defaultAllowedIds={defaultSecondaryIds}
        onItemsChange={(items) => onItemsChange('secondaryAlbumTypeOverrides', items)}
      />
      <TypeGroup
        label={translate('ReleaseStatuses')}
        types={RELEASE_STATUSES}
        items={releaseStatusOverrides}
        typeKey="releaseStatus"
        defaultAllowedIds={defaultReleaseIds}
        onItemsChange={(items) => onItemsChange('releaseStatusOverrides', items)}
      />
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
