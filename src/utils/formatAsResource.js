import pluralize from 'pluralize';

export default function formatAsResource(name) {
  return pluralize(
    name.replace(/[a-z]([A-Z])/g, i => {
      return `${i[0]}-${i[1].toLowerCase()}`;
    }).toLowerCase().replace(/\-adapter$/, '')
  );
}
