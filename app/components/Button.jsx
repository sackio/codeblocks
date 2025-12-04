import React from 'react';

import styles from 'styles/components/button';


const Button = ({ text, icon, active, onClick, disabled }) => {
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

  return (
    <div className={className} onClick={handleClick}>
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
