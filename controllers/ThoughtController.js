const { Thought, User } = require("../models/Index");

// get all thoughts
function getThoughts (req, res) {
    Thought.find({}). then((data) => {
        res.json(data);
    });
}

// add a thought
async function createThought(req, res) {
    try {
            const thought = await Thought.create({
                thoughtText: req.body.thoughtText,
                username: req.body.username,
            });
            // find another user and add thought
            await User.findByIdAndUpdate(
                req.body.userId,
                {$push: { thoughts: thought._id } }
            );
            res.json({ message: "Thought created!", thought });
        } catch (err) {
            console.log(err);
            res.status(500)
         }
}

    // update thought
    function updateThought(req, res) {
        Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true })
        .then((data) => {
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Invalid thought id"});
            }
        })
        .catch((err) => {
            res.status(404).json({ message: "Unable to update thought!" });
        });
    }

    // get single thought
    function getSingleThought(req, res) {
        Thought.findById(req.params.thoughtId)
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((err) => {
            res.status(404).json({ message: "invalid thought id!" });
        });
    }

    // delete a thought
    async function deleteThought(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if (thought) {
                await Thought.deleteOne(thought);
                const user = await User.findByIdAndUpdate(thought.userId, {
                    $pull: {thoughts: thought.id },
                });
                res.status(200).json({ message: "Invalid thought id!" });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Unable to delete thought!" });
        }
    }

    //  get all reaction
    async function getReactions(req, res) {
        try {
            const thought = await Thought.findById(req.params.id);
            res.json(thought.reactions);
        } catch (err) {
            res.status(404).json({ message: "Invalid thoughtId!" });
        }
    }

    // add a reaction to a thought
    async function addReaction(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.id,
                {
                    $push: { reactions: req.body},
                },
                { new: true }
            );
            res.json(thought);
        } catch (err) {
            res.status(404).json({ message: "Invalid thoughtId!"});
        }
    }

    // delete reaction
    async function deleteReaction(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(
                req.params.thoughtId,
                {
                    $pull: { reactions: {_id: req.params.reactionId } },
                },
                { new: true }
            );
            if (thought) {
                res.json(thought);
            } else {
                res.status(404).json ({ message: "invalid thoughtId!"});
            }
        } catch (err) {
            res.status(404).json({ message: "invalid thoughtId or reactionId!"});
        }
    }

    module.exports = {
        getThoughts,
        createThought,
        getSingleThought,
        deleteThought,
        updateThought,
        getReactions,
        addReaction,
        deleteReaction,
    }