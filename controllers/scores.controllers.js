import * as ScoresService from "../services/scores.service.js";

export async function getScores(req, res) {
  try {
    const scores = await ScoresService.getScores();
    res.status(200).json(scores);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getScoreByMemberId(req, res) {
  try {
    const member_id = req.params.id;
    const score = await ScoresService.getScoreByMemberId(member_id);

    if (score) res.status(200).json(score);
    else
      res
        .status(404)
        .json({ message: `No score found for member_id: ${member_id}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function createScore(req, res) {
  try {
    const data = req.body;

    if (!data.member_id || data.score === undefined) {
      return res
        .status(400)
        .json({ message: "member_id and score are required." });
    }

    const created_score = await ScoresService.createScore(data);

    res.status(201).json(created_score);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res
        .status(409)
        .json({ message: "Score entry already exists for this member." });
    }
    res.status(500).json({ error: error.message });
  }
}

export async function updateScore(req, res) {
  try {
    const member_id = req.params.id;
    const updates = req.body;

    const result = await ScoresService.updateScore(member_id, updates);

    if (result.affectedRows === 0) {
      res
        .status(404)
        .json({ message: `No score found for member_id: ${member_id}` });
    } else {
      res
        .status(200)
        .json({ success: true, affected_rows: result.affectedRows });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function deleteScore(req, res) {
  try {
    const member_id = req.params.id;
    const affected_rows = await ScoresService.deleteScore(member_id);

    if (affected_rows === 0) {
      res
        .status(404)
        .json({ message: `No score found for member_id: ${member_id}` });
    } else {
      res.status(200).json({ success: true, affected_rows });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
