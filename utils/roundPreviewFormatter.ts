import { IRoundPreviewDbResponse } from "../lib/round/roundPreview";
import { IRoundPreview } from "../pages/[username]/profile";


export function formatRoundPreviewGrid(roundPreivewDbResponse: IRoundPreviewDbResponse[]): IRoundPreview[]{
    return roundPreivewDbResponse.map((round: IRoundPreviewDbResponse) => {
        const { fairwaysHit, greensInReg, threePutts, totalPutts } =  round.hole_shot_details[20][0];
        const formattedRound:IRoundPreview = {
            round_id: round.round_id,
            round_date: round.round_date,
            course_id: round.course_id,
            unverified_course_id: round.unverified_course_id,
            course_name: round.user_added_course_name || round.course_name,
            tee_color: round.tee_color,
            is_user_added_course: round.is_user_added_course,
            score: round.hole_scores[20] || 0,
            fairwaysHit: fairwaysHit || "--",
            greensInReg: greensInReg || 0,
            threePutts: threePutts || 0,
            totalPutts: totalPutts || 0,
        }
        return formattedRound;
    })
}