const { Schema, model } = require('mongoose');

const userSchema = new Schema(
    {
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        cart: {
            runs: [{ type: Schema.Types.ObjectId, ref: 'Run' }],
            hikes: [{ type: Schema.Types.ObjectId, ref: 'Hike' }],
            scenics: [{ type: Schema.Types.ObjectId, ref: 'Scenic' }],
        },
    },
    { timestamps: true }
);

const User = model('user', userSchema);

module.exports = User;
