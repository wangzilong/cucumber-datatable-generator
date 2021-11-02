import React, {useEffect, useState} from 'react';
import './App.css';
import Grid from '@mui/material/Grid';
import {Button, TextField} from "@mui/material";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

const DEFAULT_JSON = '{\n "name": "James",\n "email": null,\n "client": {\n   "client_id" : 8900, \n   "account_holders": ["James", "Neo"],\n   "flags": null\n  } \n}';

function App() {
  const [json, setJson] = useState<string | undefined>(DEFAULT_JSON);
  const [header, setHeader] = useState<string | undefined>();
  const [example, setExample] = useState<string | undefined>();
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!isJson()) {
      setError("Invalid");
    }else {
      setError(undefined);
    }
  }, [json]);

  useEffect(() => {
    onClickGenerateBtn();
  }, []);

  const onClickGenerateBtn = () => {
    if (!isJson()) {
      setHeader(undefined);
      setExample(undefined);
      setData(undefined);
    } else {
      if (json) {
        setHeader(getHeader(JSON.parse(json)));
        setExample(getExample(JSON.parse(json)));
        setData(getData(JSON.parse(json)));
      }
    }
  }

  const getHeader = (j: any, parent?: string): string | undefined => {
    if (error) {
      return undefined;
    } else {
      const h = Object.entries(j).map(e => {
        const header = parent ? `${parent}.${e[0]}` : e[0];
        if (isArray(e[1]) || !e[1] ) {
          return header;
        } else if ("object" === typeof e[1]) {
          return getHeader(e[1], header);
        } else {
          return header;
        }
      })
        .flatMap(e => e)
        .join(" | ");
      return parent ? h : `| ${h} |`;
    }
  }

  const getExample = (j: any, parent?: string): string | undefined => {
    if (error) {
      return undefined;
    } else {
      const h = Object.entries(j).map(e => {
        const header = parent ? `${parent}.${e[0]}` : e[0];
        if (isArray(e[1]) || !e[1]) {
          return `<${header}>`;
        } else if ("object" === typeof e[1]) {
          return getExample(e[1], header);
        } else {
          return `<${header}>`;
        }
      })
        .flatMap(e => e)
        .join(" | ");
      return parent ? h : `| ${h} |`;
    }
  }

  const getData = (j: any, parent?: string): string | undefined=> {
    if (error) {
      return undefined;
    } else {
      const h = Object.entries(j).map(e => {
        if (isArray(e[1]) && e[1]) {
          // @ts-ignore
          return e[1]?.join(',');
        } else if (!e[1]){
          return e[1];
        } else if ("object" === typeof e[1]) {
          return getData(e[1], e[0]);
        } else {
          return e[1];
        }
      })
        .flatMap(e => e)
        .join(" | ");
      return parent ? h : `| ${h} |`;
    }
  }

  const isArray = (a:any): boolean => {
    return a instanceof Array;
  }

  const isJson = () => {
    if (!json) {
      return true;
    } else if (json.startsWith("[")) {
      return false;
    } else {
      try {
        return (JSON.parse(json) && !!json);
      } catch (e) {
        return false;
      }
    }
  }

  return (
    <div className="App">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              JSON to Cucumber data table
            </Typography>
            <Button color="inherit">Login</Button>
          </Toolbar>
        </AppBar>
      </Box>
      <header className="App-header">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              id="tf-json-id"
              label="JSON"
              placeholder="Please fill json"
              multiline
              variant="outlined"
              value={json}
              style={{width: '100%'}}
              onChange={e => setJson(e?.target?.value)}
              error={!!error}
              helperText={error}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="outlined" onClick={onClickGenerateBtn} disabled={!!error}> Generate</Button>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  id="tf-header-id"
                  label="Headers"
                  variant="outlined"
                  value={header ?? " "}
                  style={{width: '100%'}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="tf-example-id"
                  label="Examples"
                  variant="outlined"
                  value={example ?? " "}
                  style={{width: '100%'}}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  id="tf-data-id"
                  label="Data"
                  variant="outlined"
                  value={data ?? " "}
                  style={{width: '100%'}}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </header>
    </div>
  );
}

export default App;
