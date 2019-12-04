"use strict";

const mongoose = require('mongoose')
const Contact = require('../models/contactModel')
const {
	MoleculerClientError
} = require("moleculer").Errors;

module.exports = {
	name: "contacts",
	model: Contact,
	/**
	 * Service settings
	 */
	settings: {
		port: 8080,
		fields: ["_id", "name", "age", "email", "owner"]
	},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {

		/**
		 * Say a 'Hello'
		 *
		 * @returns
		 */
		async getAllContact(ctx) {
			try {
				const contacts = await Contact.find({owner: ctx.meta.userId})

				return contacts
			} catch (e) {
				return new MoleculerClientError(404, "", [{
					message: "Not Found!"
				}])
			}
		},
		async addContact(ctx) {
			console.log(ctx.meta)
			const contact = new Contact({
				...ctx.params,
				owner: ctx.meta.userId
			})
			try {
				await contact.save()

				return contact
			} catch (e) {
				return new MoleculerClientError("EMail is exist!", 422, "", [{
					field: "email",
					message: "is exist"
				}])
			}
		},

		async editContact(ctx) {
			console.log(ctx.params)
			const updates = Object.keys(ctx.params.contact)
			const allowedUpdates = ['name', 'age', 'email']
			const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

			if (!isValidOperation) {
				return new MoleculerClientError(400, "", [{
					message: "Invalid update!"
				}])
			}

			try {
				const contact = await Contact.findOne({
					_id: ctx.params.id,
				})

				if (!contact) {
					return new MoleculerClientError(404, "", [{
						message: "Not Found!"
					}])
				}

				updates.forEach((update) => contact[update] = ctx.params.contact[update])
				await contact.save()
				return contact

			} catch (e) {
				return new MoleculerClientError(404, "", [{
					message: "Not Found!"
				}])
			}
		},

		async deleteContact(ctx) {
			try {
				const contact = await Contact.findOneAndDelete({
					_id: ctx.params.id
				})

				if (!contact) {
					return new MoleculerClientError(404, "", [{
						message: "Not Found!"
					}])
				}

				return user
			} catch (e) {
				return new MoleculerClientError(500, "", [{
					message: e
				}])
			}
		},
		async findContact(ctx) {
			try {
				const contact = await Contact.findOne({
					_id: ctx.params.id
				})

				return contact
			} catch (e) {
				return new MoleculerClientError(404, "", [{
					message: "Not Found!"
				}])
			}
		},

	},

	/**
	 * Events
	 */
	events: {

	},

	/**
	 * Methods
	 */
	methods: {
		
	},

	/**
	 * Service created lifecycle event handler
	 */
	created() {
		try {
			mongoose.Promise = global.Promise
			mongoose.connect(`mongodb://localhost:27017/ContactDB`, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
				useCreateIndex: true,
				useFindAndModify: false
			})
			this.logger.info('connect to db')
		} catch (e) {
			this.logger.info(e)
		}
	},

	/**
	 * Service started lifecycle event handler
	 */
	started() {
		// this.app.listen(Number(this.settings.port), err => {
		// 	if (err)
		// 		return this.broker.fatal(err);

		// 	this.logger.info(`WWW server started on port ${this.settings.port}`);
		// });
	},

	/**
	 * Service stopped lifecycle event handler
	 */
	stopped() {
		// if (this.app.listening) {
		// 	this.app.close(err => {
		// 		if (err)
		// 			return this.logger.error("WWW server close error!", err);

		// 		this.logger.info("WWW server stopped!");
		// 	});
		// }
	}
};