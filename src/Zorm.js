import ZormErrors from './ZormErrors';

class Zorm {
    /**
     * Create a new form object.
     */
    constructor(data) {
        $.extend(true, this, data);

        this.busy = false;
        this.successful = false;
        this.originalData = data;
        this.errors = new ZormErrors();
    }

    /**
     * Get the data payload for the form.
     */
    payload() {
        return _.omit(JSON.parse(JSON.stringify(this)), [
            'busy',
            'successful',
            'errors',
            'originalData'
        ]);
    }

    /**
     * Start processing the form.
     */
    startProcessing() {
        this.errors.forget();

        this.busy = true;
        this.successful = false;
    }

    /**
     * Finish processing the form.
     */
    finishProcessing() {
        this.busy = false;
        this.successful = true;
    }

    /**
     * Finish processing the form with the given errors.
     */
    finishProcessingWithErrors(errors) {
        this.errors.set(errors);

        this.busy = false;
    }

    /**
     * Reset the form back to its original state.
     */
    reset() {
        $.extend(true, this, this.originalData);
    }

    /**
     * Helper method for making POST HTTP requests.
     */
    post(uri) {
        return this.send('post', uri);
    }

    /**
     * Helper method for making PUT HTTP requests.
     */
    put(uri) {
        return this.send('put', uri);
    }

    /**
     * Helper method for making DELETE HTTP requests.
     */
    delete(uri) {
        return this.send('delete', uri);
    }

    /**
     * Send the form to the back-end server.
     */
    send(method, uri) {
        return new Promise((resolve, reject) => {
            this.startProcessing();

            Vue.http[method](uri, this.payload())
                .then(response => {
                    this.finishProcessing();

                    resolve(response.data);
                })
                .catch(errors => {
                    this.finishProcessingWithErrors(errors.data);

                    reject(errors.data);
                });
        });
    }
}

export default Zorm;
