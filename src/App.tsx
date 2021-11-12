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
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import {keys} from "./utils";

const DEFAULT_JSON = '{\n' +
  ' "name": "James",\n' +
  ' "email": null,\n' +
  ' "client": {\n' +
  '   "client_id" : 8900, \n' +
  '   "user": {\n' +
  '      "user_id": 12,\n' +
  '      "user_name": "Z"\n' +
  '   },\n' +
  '   "account_holders": ["James", "Neo"],\n' +
  '   "fees": [{"fee_id": 1}, {"fee_id": 2}]\n' +
  '  } \n' +
  '}';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder',
];

function App() {
  const [json, setJson] = useState<string>(DEFAULT_JSON);
  // ships means value will keep as json
  const [skips, setSkips] = useState<string[]>([]);
  // ignores means that exclude those attribute in result
  const [ignores, setIgnores] = useState<string[]>([]);
  const [header, setHeader] = useState<string | undefined>();
  const [headers, setHeaders] = useState<string[]>([]);
  const [example, setExample] = useState<string | undefined>();
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();

  useEffect(() => {
    if (!isJson()) {
      setError("Invalid");
    }else {
      setError(undefined);
      setHeaders(keys(JSON.parse(json)));
    }
  }, [json]);

  useEffect(() => {
    onClickGenerateBtn();
  }, [skips, ignores]);

  useEffect(() => {
    setHeader(getHeader());
    setExample(getExample());
    setData(getData(JSON.parse(json)));
  }, [headers]);

  const onClickGenerateBtn = () => {
    if (!isJson()) {
      setHeader(undefined);
      setExample(undefined);
      setData(undefined);
    } else {
      if (json) {
        setHeaders(keys(JSON.parse(json)));
      }
    }
  }

  const getHeader = (): string | undefined => {
    if (error) {
      return undefined;
    } else {
      const h = headers
        .filter(h => ignores.indexOf(h) <= -1)
        .join(" | ");
      return `| ${h} |`;
    }
  }

  const getExample = (): string | undefined => {
    if (error) {
      return undefined;
    } else {
      const h = headers
        .filter(h => ignores.indexOf(h) <= -1)
        .join("> | <");
      return `| <${h}> |`;
    }
  }

  const getData = (j: any, parent?: string): string | undefined=> {
    if (error) {
      return undefined;
    } else {
      const h = Object.entries(j).map(e => {

        const header = parent ? `${parent}.${e[0]}` : e[0];

        // keep value as string
        if (skips && skips?.includes(header)) {
          return JSON.stringify(e[1]);
        }

        // keep value as string
        if (ignores && ignores?.includes(header)) {
          return "__IGNORE__";
        }

        if (isArray(e[1]) && e[1]) {
          // @ts-ignore
          return e[1]?.join(',');
        } else if (!e[1]){
          return e[1];
        } else if ("object" === typeof e[1]) {
          return getData(e[1], header);
        } else {
          return e[1];
        }
      })
        .flatMap(e => e)
        .filter(e => e !== "__IGNORE__")
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

  const onChangedSkip = (event:any) => {
    const {
      target: { value },
    } = event;
    setSkips(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const onChangedIgnore = (event:any) => {
    const {
      target: { value },
    } = event;
    setIgnores(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

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
            <Grid container spacing={2}>
              <Grid item xs={8}>
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
              <Grid item xs={4}>
                <Grid item xs={12}>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="tf-node-keep-json-id">Value as JSON</InputLabel>
                    <Select
                      labelId="Skips-multiple-checkbox-label"
                      id="Skips-multiple-checkbox"
                      multiple
                      value={skips}
                      onChange={onChangedSkip}
                      input={<OutlinedInput label="Skips" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {headers?.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={skips.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl sx={{ m: 1, width: '100%' }}>
                    <InputLabel id="Ignores-multiple-checkbox-label">Ignores</InputLabel>
                    <Select
                      labelId="Ignores-multiple-checkbox-label"
                      id="Ignores-multiple-checkbox"
                      multiple
                      value={ignores}
                      onChange={onChangedIgnore}
                      input={<OutlinedInput label="Ignores" />}
                      renderValue={(selected) => selected.join(', ')}
                      MenuProps={MenuProps}
                    >
                      {headers?.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={ignores.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Grid>
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
