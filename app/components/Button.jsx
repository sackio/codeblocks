import React from 'react';

import styles from 'styles/components/button';


const Button = ({ text, icon, active, onClick, disabled, dataMode }) => {
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  let className = styles.button;
  if (active) {
    className = styles.active;
  } else if (disabled) {
    className = styles.disabled;
  }

  const dataAttrs = {};
  if (dataMode) {
    dataAttrs['data-mode'] = dataMode;
  }

  return (
    <div className={className} onClick={handleClick} {...dataAttrs}>
      <div className={styles.icon}>
        <i className={`ion-${icon}`} />
      </div>
      <div className={styles.text}>
        {text}
      </div>
    </div>
  );
};


export default Button;
