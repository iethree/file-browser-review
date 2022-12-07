// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import { vi  } from 'vitest';
import '@testing-library/jest-dom'
global.vi.fn = vi.fn;
global.React = React;
