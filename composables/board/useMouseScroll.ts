import {onBeforeUnmount, Ref} from 'vue';
import {addListener} from 'bash-frontend-kit/utils/el/addListener';
import {Offset} from 'bash-frontend-kit/types/app/Offset';

// Positive force range: 2-10
const forceSteps = 8;
const minForce = 2;
const scrollEdgeOffset = 100;

const scrollForce = {
  x: 0,
  y: 0,
};

function calcForce(position: number, positiveForce: boolean) {
  let force;
  if (positiveForce) {
    force = Math.ceil((1 + position / scrollEdgeOffset) * forceSteps);
  } else {
    force = Math.floor((1 - position / scrollEdgeOffset) * -forceSteps);
  }

  return force !== 0
    ? force + (minForce - 1) * (positiveForce ? 1 : -1)
    : force;
}

export function useMouseScroll(
  el: HTMLElement,
  disabled?: Ref,
  offset?: Ref<Offset>
) {
  const scrolling = ref(false);

  const unobserveMouseMoveListener = addListener(el, 'mousemove', onMouseMove);

  onBeforeUnmount(() => {
    if (unobserveMouseMoveListener) {
      unobserveMouseMoveListener();
    }
  });

  function onMouseMove(e) {
    if (disabled && disabled.value) {
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.pageX - rect.x;
    const y = e.pageY - rect.y;

    if (x - (offset?.value.left ?? 0) < scrollEdgeOffset) {
      scrollForce.x = calcForce(x, false);
    } else if (x + (offset?.value.right ?? 0) > rect.width - scrollEdgeOffset) {
      scrollForce.x = calcForce(x - rect.width, true);
    } else {
      scrollForce.x = 0;
    }

    if (y - (offset?.value.top ?? 0) < scrollEdgeOffset) {
      scrollForce.y = calcForce(y, false);
    } else if (
      y - (offset?.value.bottom ?? 0) >
      rect.height - scrollEdgeOffset
    ) {
      scrollForce.y = calcForce(y - rect.height, true);
    } else {
      scrollForce.y = 0;
    }

    scrolling.value = !!(scrollForce.x || scrollForce.y);
  }

  watch(
    scrolling,
    (scrollingState) => {
      if (scrollingState) {
        let prevAnimationTimestamp = 0;

        requestAnimationFrame(function tick(timestamp) {
          if (!prevAnimationTimestamp) {
            prevAnimationTimestamp = timestamp;
          }

          const timestampOffset = (timestamp - prevAnimationTimestamp) / 10;

          el.scrollBy(
            scrollForce.x * timestampOffset,
            scrollForce.y * timestampOffset
          );

          if (scrolling.value) {
            requestAnimationFrame(tick);
            prevAnimationTimestamp = timestamp;
          }
        });
      }
    },
    { immediate: true }
  );

  return scrolling;
}
