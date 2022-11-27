import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import { IRoundPreview } from "../pages/[username]/profile";
import { useRouter } from "next/router";

interface IRoundPreviewProps {
  roundPreview: IRoundPreview[];
}

const columns: GridColDef[] = [
  {
    field: "Date",
    headerName: "Date",
    width: 180,
    valueGetter: (params: GridValueGetterParams) => `${params.row.round_date || ""}`,
  },
  {
    field: "Course",
    headerName: "Course",
    width: 200,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.course_name || ""}`,
  },
  {
    field: "Score",
    headerName: "Score",
    width: 30,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.score || ""}`,
  },
  {
    field: "FW Hit",
    headerName: "FW Hit",
    width: 150,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.fairwaysHit || ""}`,
  },
  {
    field: "GIR",
    headerName: "GIR",
    type: "number",
    width: 110,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.greensInReg || ""}`,
  },
  {
    field: "3-Putts",
    headerName: "3-Putts",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) => `${params.row.threePutts || ""}`,
  },
  {
    field: "Total Putts",
    headerName: "Total Putts",
    type: "number",
    width: 110,
    editable: true,
    valueGetter: (params: GridValueGetterParams) => `${params.row.totalPutts || ""}`,
  },
];

const RoundPreviewGrid: React.FC<IRoundPreviewProps> = ({ roundPreview }: IRoundPreviewProps) => {
  const router = useRouter();
  const username = router.query.username;

  function viewRound(row: IRoundPreview) {
    const {
      course_id: courseId,
      unverified_course_id: unverifiedCourseId,
      round_id: roundid,
      tee_color: teeColor,
      is_user_added_course: isUserAddedCourse,
    } = row;
    router.push(
      {
        pathname: `/${username}/round/${roundid}`,
        query: {
          roundid,
          courseId,
          teeColor,
          isUserAddedCourse,
          unverifiedCourseId,
        },
      },
      `/${username}/round/${roundid}`
    );
  }

  return (
    <Box sx={{ height: 700, width: "100%" }}>
      <DataGrid
        getRowId={row => row.round_id}
        rows={roundPreview}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onRowClick={row => viewRound(row.row)}
        density="standard"
        sortModel={[{ field: "Date", sort: "desc" }]}
      />
    </Box>
  );
};

export default RoundPreviewGrid;
