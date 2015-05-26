define(['exports', 'module', '../util/get-bound-next'], function (exports, module, _utilGetBoundNext) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequire(obj) { return obj && obj.__esModule ? obj['default'] : obj; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _getBoundNext = _interopRequire(_utilGetBoundNext);

    /**
      A micro task queue specialized for scheduler use.
      @class MicroTaskQueue
    */

    var MicroTaskQueue = (function () {
        function MicroTaskQueue() {
            _classCallCheck(this, MicroTaskQueue);

            this._queue = [];
            this.isProcessing = false;
            this.isDisposed = false;
            this._flushNext = (0, _getBoundNext)(this.flush.bind(this));
        }

        _createClass(MicroTaskQueue, [{
            key: 'enqueue',

            /**
              Enqueues a task to be run based on the state, work and scheduler passed
              @method enqueue
              @param state {Object} the state to run the work against.
              @param work {Function} the work to be done
              @param scheduler {Scheduler} the scheduler the work is being done for.
              @return {MicroTask} a micro task which is disposable.
            */
            value: function enqueue(state, work, scheduler) {
                var task = new MicroTask(this, state, work, scheduler);
                this._queue.push(task);
                this.scheduleFlush();
                return task;
            }
        }, {
            key: 'dequeue',

            /**
              Removes a micro task from the queue
              @method dequeue
              @param task {MicroTask} the task to dequeue
            */
            value: function dequeue(task) {
                this._queue.splice(this._queue.indexOf(task), 1);
            }
        }, {
            key: 'dispose',

            /**
              Clears the queue and prevents any delayed execution of tasks.
              @method dispose
            */
            value: function dispose() {
                this._queue.length = 0;
                this.isProcessing = false;
                this.isDisposed = true;
            }
        }, {
            key: 'scheduleFlush',

            /**
              Schedules a flush to be called as a micro task if possible. Otherwise as a setTimeout.
              See `utils/get-bound-next'
              @method scheduleFlush
            */
            value: function scheduleFlush() {
                if (!this.isProcessing) {
                    this.isProcessing = true;
                    this._flushNext();
                }
            }
        }, {
            key: 'flush',

            /**
              Processes the queue of tasks.
              @method flush
            */
            value: function flush() {
                var start = Date.now();
                while (this._queue.length > 0) {
                    var task = this._queue.shift();
                    task.work(task.scheduler, task.state);
                }
                if (this._queue.length > 0) {
                    this._flushNext();
                } else {
                    this.isProcessing = false;
                }
            }
        }]);

        return MicroTaskQueue;
    })();

    module.exports = MicroTaskQueue;

    /**
      A structure for defining a task on a MicroTaskQueue
      @class MicroTask
    */

    var MicroTask = (function () {
        function MicroTask(queue, state, work, scheduler) {
            _classCallCheck(this, MicroTask);

            this.queue = queue;
            this.state = state;
            this.work = work;
            this.scheduler = scheduler;
        }

        _createClass(MicroTask, [{
            key: 'dispose',

            /**
              dequeues the task from it's queue
              @method dispose
            */
            value: function dispose() {
                this.queue.dequeue(this);
            }
        }]);

        return MicroTask;
    })();
});

//# sourceMappingURL=micro-task-queue.js.map