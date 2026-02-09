import * as ScoresService from "../services/scores.services.js";

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

export async function uploadScoreCsv(req, res) {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No CSV file uploaded." });
    }

    const pointsToAdd = req.body.points ? parseInt(req.body.points) : 1;

    const fileContent = req.file.buffer.toString("utf-8");
    const lines = fileContent.split(/\r?\n/); // Split by new line

    const entriesToProcess = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue; // Skip empty lines

      const columns = line.split(",");

      const rawId = columns[2];

      if (rawId) {
        const memberId = rawId.replace(/['"]+/g, "").trim();

        if (/^\d+$/.test(memberId)) {
          entriesToProcess.push([parseInt(memberId), pointsToAdd]);
        }
      }
    }

    if (entriesToProcess.length === 0) {
      return res
        .status(400)
        .json({ message: "No valid member IDs found in CSV." });
    }

    const result = await ScoresService.bulkTallyScores(entriesToProcess);

    res.status(200).json({
      success: true,
      message: `Processed ${entriesToProcess.length} records.`,
      affected_rows: result.affectedRows,
    });
  } catch (error) {
    console.error("CSV Upload Error:", error);
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
