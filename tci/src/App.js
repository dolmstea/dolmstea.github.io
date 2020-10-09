import React from 'react';
import { VictoryChart, VictoryLine, VictoryAxis, VictoryLabel, VictoryLegend } from 'victory';
import { Container, Form, InputGroup, Col, Button, Row, Alert } from 'react-bootstrap';

import './App.css';
import tci from './tci.js';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      wgt: 70,
      bol: 100,
      rate: 100,
      c1: [],
      c2: [],
      c3: [],
      xTickValues: [0]
    }

    this.wgt = React.createRef();
    this.bol = React.createRef();
    this.rate = React.createRef();
  }

  componentDidMount() {
    this.loadGraph();
  }

  formChange(event) {
    this.setState({
      wgt: this.wgt.current.value,
      bol: this.bol.current.value,
      rate: this.rate.current.value
    });
    this.loadGraph();
  }

  loadGraph() {
    let d = tci(this.state.wgt, this.state.bol, this.state.rate);

    let c1 = [];
    let c2 = [];
    let c3 = [];

    for(let i of d) {
      c1.push({x: i.t, y: i.c1});
      c2.push({x: i.t, y: i.c2});
      c3.push({x: i.t, y: i.c3});
    }
    
    let numOfTicks = Math.floor(c1.length/60);

    let xTickValues = [0];

    for(let i = 0; i < numOfTicks; i++) {
      xTickValues.push((i+1) * 60);
    }

    this.setState({
      c1: c1,
      c2: c2,
      c3: c3,
      xTickValues: xTickValues
    })
  }

  render() {
    return (
      <Container fluid>
        <Row>
          <Col className='mt-3'>
            <Alert variant='secondary'>
              This is a simple tool to model drug compartment concentration. Select a PK model, then fill in the required parameters and press Update.
            </Alert>
            <Alert variant='danger'>
              IMPORTANT: This tool is actively under development and has not been validated for clinical use.
            </Alert>
          </Col>
        </Row>
        <Row>
          <Col xs={3} className='pt-3'>
            <Form>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{width: 75}}>Model</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control as='select'>
                    <option>Marsh (propofol)</option>
                    <option>Minto (remifentanil)</option>
                    <option>Custom</option>
                  </Form.Control>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{width: 75}}>Weight</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type='text' ref={this.wgt} defaultValue={this.state.wgt} />
                  <InputGroup.Append>
                    <InputGroup.Text>kg</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{width: 75}}>Bolus</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type='text' ref={this.bol} defaultValue={this.state.bol} />
                  <InputGroup.Append>
                    <InputGroup.Text>mg</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <InputGroup>
                  <InputGroup.Prepend>
                    <InputGroup.Text style={{width: 75}}>Rate</InputGroup.Text>
                  </InputGroup.Prepend>
                  <Form.Control type='text' ref={this.rate} defaultValue={this.state.rate} />
                  <InputGroup.Append>
                    <InputGroup.Text>mcg/kg/min</InputGroup.Text>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
              <Form.Group>
                <Button onClick={this.formChange.bind(this)}>
                  Update
                </Button>
              </Form.Group>
            </Form>
            <p>&copy; 2020 David Olmstead</p>
          </Col>
          <Col xs={9}>
            <VictoryChart
              padding={{top: 10, bottom: 50, left: 50, right: 10}}
              maxDomain={{y: 8}} >
              <VictoryAxis
                label='Time (s)'
                style={{ 
                  tickLabels: { fontSize: 5 },
                  grid: { stroke: '#AAAAAA' }
                }}
                tickValues={this.state.xTickValues} />
              <VictoryAxis
                dependentAxis
                label='Conc (mcg/mL)'
                style={{ tickLabels: { fontSize: 5 } }}
                axisLabelComponent={<VictoryLabel dy={-10} />} />
              <VictoryLine
                style={{
                  data: { stroke: '#000000' }
                }}
                data={this.state.c1} />
              <VictoryLine
                style={{
                  data: { stroke: '#888888' }
                }}
                data={this.state.c2} />
              <VictoryLine
                style={{
                  data: { stroke: '#CCCCCC' }
                }}
                data={this.state.c3} />
              <VictoryLegend
                x={250}
                y={50}
                colorScale={[ '#000000', '#888888', '#CCCCCC' ]}
                style={{
                  border: { fill: '#FFF', stroke: '#000' },
                  labels: { fontSize: 10 }
                }}
                data={[
                  {name: 'C1 (Plasma)'},
                  {name: 'C2 (Vessel-Rich)'},
                  {name: 'C3 (Vessel-Poor)'}
                ]} />
            </VictoryChart>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;
