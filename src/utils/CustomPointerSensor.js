import { PointerSensor } from '@dnd-kit/core';

export class CustomPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({ nativeEvent: event }) => {
        if (
          !event.isPrimary ||
          event.button !== 0 ||
          event.target.closest('[data-no-dnd]')
        ) {
          return false;
        }

        return true;
      },
    },
  ];
}