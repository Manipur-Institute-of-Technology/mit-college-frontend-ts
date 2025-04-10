const FUNC_ERROR_TEXT = "Expected a function";

/**
 * Creates a debounced version of a function with a maximum wait time.
 * The debounced function will delay invoking the provided function until after
 * a specified time has elapsed since the last time it was invoked.
 * It also ensures that the function is called at least once within maxWait time.
 *
 * @param fn - The function to debounce
 * @param ms - The number of milliseconds to delay the function execution
 * @param options - Configuration options
 * @param options.maxWait - The maximum time to wait before forcing function execution
 *
 * @returns A new debounced function that delays invoking `fn` until after `ms`
 * milliseconds have elapsed since the last time it was invoked, with a guarantee
 * that the function will be called at least once every `maxWait` milliseconds
 *
 * @example
 * ```typescript
 * const debouncedFn = debounce(
 *   () => console.log('executed'),
 *   300,
 *   { maxWait: 1000 }
 * );
 * ```
 */
export const debounce = (
  fn: Function,
  ms: number,
  { maxWait = 1000 }: { maxWait?: number },
) => {
  let timeoutId: number | null = null;
  let lastCallTime: number | null = null;
  let maxWaitTimeout: number | null = null;

  const debouncedFn = function (this: any, ...args: any[]) {
    const currentTime = Date.now();

    if (!lastCallTime) {
      lastCallTime = currentTime;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const timeSinceLastCall = currentTime - lastCallTime;
    if (timeSinceLastCall >= maxWait) {
      if (maxWaitTimeout) {
        clearTimeout(maxWaitTimeout);
        maxWaitTimeout = null;
      }
      fn.apply(this, args);
      lastCallTime = currentTime;
      return;
    }

    timeoutId = window.setTimeout(() => {
      fn.apply(this, args);
      timeoutId = null;
      lastCallTime = null;
      if (maxWaitTimeout) {
        clearTimeout(maxWaitTimeout);
        maxWaitTimeout = null;
      }
    }, ms);

    if (!maxWaitTimeout) {
      maxWaitTimeout = window.setTimeout(() => {
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        fn.apply(this, args);
        lastCallTime = null;
        maxWaitTimeout = null;
      }, maxWait);
    }
  };

  debouncedFn.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    if (maxWaitTimeout) {
      clearTimeout(maxWaitTimeout);
      maxWaitTimeout = null;
    }
    lastCallTime = null;
  };

  return debouncedFn;
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
// export function debounce(func: Function, wait: number = 0, options: {}) {
// 	var lastArgs,
// 		lastThis,
// 		maxWait,
// 		result,
// 		timerId,
// 		lastCallTime,
// 		lastInvokeTime = 0,
// 		leading = false,
// 		maxing = false,
// 		trailing = true;

// 	if (typeof func != "function") {
// 		throw new TypeError(FUNC_ERROR_TEXT);
// 	}
// 	wait = toNumber(wait) || 0;
// 	if (isObject(options)) {
// 		leading = !!options.leading;
// 		maxing = "maxWait" in options;
// 		maxWait = maxing
// 			? nativeMax(toNumber(options.maxWait) || 0, wait)
// 			: maxWait;
// 		trailing = "trailing" in options ? !!options.trailing : trailing;
// 	}

// 	function invokeFunc(time) {
// 		var args = lastArgs,
// 			thisArg = lastThis;

// 		lastArgs = lastThis = undefined;
// 		lastInvokeTime = time;
// 		result = func.apply(thisArg, args);
// 		return result;
// 	}

// 	function leadingEdge(time) {
// 		// Reset any `maxWait` timer.
// 		lastInvokeTime = time;
// 		// Start the timer for the trailing edge.
// 		timerId = setTimeout(timerExpired, wait);
// 		// Invoke the leading edge.
// 		return leading ? invokeFunc(time) : result;
// 	}

// 	function remainingWait(time) {
// 		var timeSinceLastCall = time - lastCallTime,
// 			timeSinceLastInvoke = time - lastInvokeTime,
// 			timeWaiting = wait - timeSinceLastCall;

// 		return maxing
// 			? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
// 			: timeWaiting;
// 	}

// 	function shouldInvoke(time) {
// 		var timeSinceLastCall = time - lastCallTime,
// 			timeSinceLastInvoke = time - lastInvokeTime;

// 		// Either this is the first call, activity has stopped and we're at the
// 		// trailing edge, the system time has gone backwards and we're treating
// 		// it as the trailing edge, or we've hit the `maxWait` limit.
// 		return (
// 			lastCallTime === undefined ||
// 			timeSinceLastCall >= wait ||
// 			timeSinceLastCall < 0 ||
// 			(maxing && timeSinceLastInvoke >= maxWait)
// 		);
// 	}

// 	function timerExpired() {
// 		var time = now();
// 		if (shouldInvoke(time)) {
// 			return trailingEdge(time);
// 		}
// 		// Restart the timer.
// 		timerId = setTimeout(timerExpired, remainingWait(time));
// 	}

// 	function trailingEdge(time) {
// 		timerId = undefined;

// 		// Only invoke if we have `lastArgs` which means `func` has been
// 		// debounced at least once.
// 		if (trailing && lastArgs) {
// 			return invokeFunc(time);
// 		}
// 		lastArgs = lastThis = undefined;
// 		return result;
// 	}

// 	function cancel() {
// 		if (timerId !== undefined) {
// 			clearTimeout(timerId);
// 		}
// 		lastInvokeTime = 0;
// 		lastArgs = lastCallTime = lastThis = timerId = undefined;
// 	}

// 	function flush() {
// 		return timerId === undefined ? result : trailingEdge(now());
// 	}

// 	function debounced() {
// 		var time = now(),
// 			isInvoking = shouldInvoke(time);

// 		lastArgs = arguments;
// 		lastThis = this;
// 		lastCallTime = time;

// 		if (isInvoking) {
// 			if (timerId === undefined) {
// 				return leadingEdge(lastCallTime);
// 			}
// 			if (maxing) {
// 				// Handle invocations in a tight loop.
// 				clearTimeout(timerId);
// 				timerId = setTimeout(timerExpired, wait);
// 				return invokeFunc(lastCallTime);
// 			}
// 		}
// 		if (timerId === undefined) {
// 			timerId = setTimeout(timerExpired, wait);
// 		}
// 		return result;
// 	}
// 	debounced.cancel = cancel;
// 	debounced.flush = flush;
// 	return debounced;
// }
