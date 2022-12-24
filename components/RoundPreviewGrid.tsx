import React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridColDef, GridValueGetterParams, GridSortModel } from "@mui/x-data-grid";
import { IRoundPreview } from "../pages/[username]/profile";
import { useRouter } from "next/router";
import useMediaQuery from "./useMediaQuery";

interface IRoundPreviewProps {
  roundPreview: IRoundPreview[];
}

const RoundPreviewGrid: React.FC<IRoundPreviewProps> = ({ roundPreview }: IRoundPreviewProps) => {
  const router = useRouter();
  const username = router.query.username;
  const mobileViewPort = useMediaQuery(600);

  const columns: GridColDef[] = [
    {
      field: "Score",
      headerName: "Score",
      width: mobileViewPort ? 55 : 150,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.score || ""}`,
    },
    {
      field: "FW Hit",
      headerName: "FW Hit",
      width: mobileViewPort ? 75 : 150,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.fairwaysHit || ""}`,
    },
    {
      field: "GIR",
      headerName: "GIR",
      type: "number",
      description: "Greens In Regulation",
      headerAlign: "left",
      align: "left",
      width: mobileViewPort ? 55 : 150,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `${params.row.greensInReg || ""}`,
    },
    {
      field: "3-Putts",
      headerName: "3-Putts",
      headerAlign: "left",
      align: "left",
      editable: false,
      width: mobileViewPort ? 65 : 150,
      valueGetter: (params: GridValueGetterParams) => `${params.row.threePutts || ""}`,
    },
    {
      field: "Total Putts",
      headerName: "Total Putts",
      type: "number",
      width: mobileViewPort ? 85 : 150,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.totalPutts || ""}`,
    },
    {
      field: "Course",
      headerName: "Course",
      width: 200,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.course_name || ""}`,
    },
    {
      field: "Date",
      headerName: "Date",
      type: "dateTime",
      width: 200,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.round_date || ""}`,
    },
  ];

  const [sortModel, setSortModel] = React.useState<GridSortModel>([
    {
      field: "Date",
      sort: "desc",
    },
  ]);

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
    <Box sx={{ height: 700, width: "100%", cursor: "pointer" }}>
      <DataGrid
        getRowId={row => row.round_id}
        rows={roundPreview}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        onRowClick={row => viewRound(row.row)}
        density="standard"
        sortModel={sortModel}
        onSortModelChange={newSortModel => setSortModel(newSortModel)}
      />
    </Box>
  );
};

export default RoundPreviewGrid;
