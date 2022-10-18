const { Schema, model } = require('mongoose');

const archiveDataSchema = new Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now
        },
        user_id: {
            type: String,
        },
        game_id: {
            type: String,
        },
        stream_id: {
            type: String,
        },
        view_count: {
            type: Number
        },
    }
);

const ArchiveData = model('ArchiveData', archiveDataSchema);

module.exports = ArchiveData;
