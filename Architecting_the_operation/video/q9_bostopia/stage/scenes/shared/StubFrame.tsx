import React from 'react';
import type {SceneProps} from '@stage';

export function StubFrame({title}: {title: string} & SceneProps) {
  return (
    <div
      data-text="stub"
      data-box="60 140 960 80"
      style={{position: 'absolute', left: 60, top: 140, width: 960, height: 80, font: '56px "IBM Plex Sans"', color: '#f4efe4'}}
    >
      {title}
    </div>
  );
}
