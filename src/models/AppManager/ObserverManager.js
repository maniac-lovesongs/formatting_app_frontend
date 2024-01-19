class ObserverManager{
    constructor() {
        this.listeners = [];
    }

    registerListener(callback) {
        this.listeners.push(callback);
        return this.listeners.length - 1; 
    }

    unregisterListener(id) {
        this.listeners[id] = null;
    }

    notify(dataChanged) {
        // This handles multiple data changed at the same time.
        const data = Array.isArray(dataChanged) ? dataChanged : [dataChanged];
        const listeners = this.listeners;

        data.forEach((d) => {
            listeners.forEach((listener, i) => {
                if (listener !== null && listener !== undefined)
                    listener(d);
            });
        });
    }
}

const observerManager = new ObserverManager();
export default observerManager;