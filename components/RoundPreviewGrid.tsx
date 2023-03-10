import React from "react";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridSortModel,
  GridValueFormatterParams,
} from "@mui/x-data-grid";
import { IRoundPreview } from "../pages/[username]/profile";
import { useRouter } from "next/router";
import useMediaQuery from "./useMediaQuery";
import { Typography } from "@mui/material";
import { nonNullQueryParams } from "../utils/queryParamFormatter";

export interface IRoundPreviewProps {
  roundPreview: IRoundPreview[];
}

const RoundPreviewGrid: React.FC<IRoundPreviewProps> = ({ roundPreview }: IRoundPreviewProps) => {
  const router = useRouter();
  const username = router.query.username;
  const mobileViewPort = useMediaQuery(600);

  const columns: GridColDef[] = [
    {
      field: "Course",
      headerName: "Course",
      headerClassName: "super-app-theme--header",
      width: 200,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.course_name || ""}`,
    },
    {
      field: "Score",
      headerName: "Score",
      headerClassName: "super-app-theme--header",
      width: mobileViewPort ? 55 : 150,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.score || ""}`,
    },
    {
      field: "FW Hit",
      headerName: "FW Hit",
      headerClassName: "super-app-theme--header",
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
      headerClassName: "super-app-theme--header",
      align: "left",
      width: mobileViewPort ? 55 : 150,
      editable: false,
      valueGetter: (params: GridValueGetterParams) => `${params.row.greensInReg || ""}`,
    },
    {
      field: "3-Putts",
      headerName: "3-Putts",
      headerClassName: "super-app-theme--header",
      headerAlign: "left",
      align: "left",
      editable: false,
      width: mobileViewPort ? 65 : 150,
      valueGetter: (params: GridValueGetterParams) => `${params.row.threePutts || ""}`,
    },
    {
      field: "Total Putts",
      headerName: "Total Putts",
      headerClassName: "super-app-theme--header",
      type: "number",
      width: mobileViewPort ? 85 : 150,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => `${params.row.totalPutts || ""}`,
    },
    {
      field: "Date",
      headerName: "Date",
      headerClassName: "super-app-theme--header",
      type: "dateTime",
      width: 200,
      editable: false,
      headerAlign: "left",
      align: "left",
      valueGetter: (params: GridValueGetterParams) => new Date(params.row.round_date),
      valueFormatter: (params: GridValueFormatterParams) =>
        params.value.toLocaleString("en-US").split(",")[0],
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
    } = row;
    const query = nonNullQueryParams(courseId, unverifiedCourseId);
    router.push({
      pathname: `/${username}/round/${roundid}`,
      query,
    });
  }

  return (
    <Box
      sx={{
        height: 700,
        width: "100%",
        cursor: "pointer",
        backgroundColor: "white",
        "& .super-app-theme--header": {
          backgroundColor: "#c4f2ff",
        },
      }}
    >
      <DataGrid
        components={{
          NoRowsOverlay: () => {
            return (
              <Box my={5}>
                <Typography variant="h4">No rounds recorded</Typography>
              </Box>
            );
          },
        }}
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
