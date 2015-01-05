import Promise from 'bluebird';

export default function() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      return resolve();
    }

    setTimeout(reject, 5000);
    document.addEventListener('DOMContentLoaded', resolve, false);
  });
};
