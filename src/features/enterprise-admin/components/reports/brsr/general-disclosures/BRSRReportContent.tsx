import React, { useState, useEffect } from "react";
import { Table } from "@/components/ui/table";

const tableStyles = `
  .custom-table {
    width: 100%;
    border-collapse: collapse;
  }
  .custom-table.striped tr:nth-child(even) {
    background-color: #f2f2f2;
  }
  .custom-table.bordered {
    border: 1px solid #ddd;
  }
  .custom-table.bordered th, 
  .custom-table.bordered td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  .custom-table.hover tr:hover {
    background-color: #e9e9e9;
  }
  .custom-table.responsive {
    overflow-x: auto;
  }
  .custom-table.sm {
    font-size: 0.875rem;
  }
  .custom-table.md {
    font-size: 1rem;
  }
`;

// Utility Functions
const findKeyRecursively = (obj, targetKey) => {
  if (!obj || typeof obj !== "object") return "N/A";
  if (obj.hasOwnProperty(targetKey)) return obj[targetKey];
  for (const key in obj) {
    if (typeof obj[key] === "object") {
      const result = findKeyRecursively(obj[key], targetKey);
      if (result !== "N/A") return result;
    }
  }
  return "N/A";
};

const renderNestedObject = (data, depth = 0) => {
  if (!data || typeof data !== "object") return <p>{data}</p>;
  if (Array.isArray(data)) {
    return (
      <div style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "20px" }}>
        <Table className='striped bordered hover responsive size="sm"'>
          <thead>
            <tr><th>#</th><th>Value</th></tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{typeof item === "object" ? renderNestedObject(item, depth + 1) : item}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  }

  const filteredData = Object.entries(data).filter(
    ([key]) => !["_id", "createdAt", "updatedAt"].includes(key)
  );

  return (
    <div style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "20px" }}>
      <Table className="custom-table striped bordered hover responsive sm">
        <thead>
          <tr><th>Key</th><th>Value</th></tr>
        </thead>
        <tbody>
          {filteredData.map(([key, value]) => (
            <tr key={key}>
              <td style={{ fontWeight: "normal" }}>{key.replace(/_/g, " ")}</td>
              <td style={{ fontWeight: "normal" }}>
                {/* {typeof value === "object" && value !== null ? renderNestedObject(value, depth + 1) : value} */}
                <td style={{ fontWeight: "normal" }}>
                  {typeof value === "object" && value !== null
                    ? renderNestedObject(value, depth + 1)
                    : String(value)}
                </td>

              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

const renderTable = (dataArray) => {
  if (!Array.isArray(dataArray) || dataArray.length === 0) return <p>No data available.</p>;

  const filteredKeys = Object.keys(dataArray[0]).filter(
    (key) => !["_id", "createdAt", "updatedAt"].includes(key)
  );

  return (
    <div style={{ marginTop: "10px", marginBottom: "10px", marginLeft: "20px" }}>
      <Table className="custom-table striped bordered hover responsive md">
        <thead>
          <tr>
            {filteredKeys.map((header, idx) => <th key={idx}>{header.replace(/_/g, " ")}</th>)}
          </tr>
        </thead>
        <tbody>
          {dataArray.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {filteredKeys.map((key, cellIndex) => (
                <td key={cellIndex} style={{ fontWeight: "normal" }}>
                  {typeof row[key] === "object" && row[key] !== null ? renderNestedObject(row[key]) : row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

// Grouping function
const groupBySectionAndPrincipal = (reportTagging) => {
  const grouped = {};
  reportTagging.forEach((item) => {
    const { section, principal } = item;
    if (!grouped[section]) grouped[section] = {};
    if (!grouped[section][principal]) grouped[section][principal] = [];
    grouped[section][principal].push(item);
  });
  return grouped;
};

// Main Component
const BRSRReportContent = ({ companyData, reportTagging }) => {
  const groupedBySectionAndPrincipal = groupBySectionAndPrincipal(reportTagging);

  return (
    <div className="report-content">
      {/* SECTION A */}
      <section className="mb-8">
        <h4 className="text-uppercase mb-3 fw-bolder">SECTION A: GENERAL DISCLOSURES</h4>
        {groupedBySectionAndPrincipal["A"] &&
          groupedBySectionAndPrincipal["A"][null]?.map(({ keyName, question }, index) => {
            const answer = findKeyRecursively(companyData, keyName);
            return (
              <div key={index} className="mb-4">
                <strong>{index + 1}. {question}</strong>
                {renderNestedObject(answer)}
              </div>
            );
          })}
      </section>

      {/* SECTION B */}
      <section className="mb-8">
        <h4 className="text-uppercase mb-3 fw-bolder">SECTION B: MANAGEMENT AND PROCESS DISCLOSURES</h4>
        {groupedBySectionAndPrincipal["B"] &&
          groupedBySectionAndPrincipal["B"][null].map(({ keyName, question }, index) => {
            const answer = findKeyRecursively(companyData, keyName);
            return (
              <div key={index} className="mb-4">
                <strong>{index + 1}. {question}</strong>
                {renderNestedObject(answer)}
              </div>
            );
          })}
      </section>

      {/* SECTION C - PRINCIPLES */}
      {Object.keys(groupedBySectionAndPrincipal["C"] || {}).map((principalKey) => (
        <section key={principalKey} className="mb-8">
          <h4 className="text-uppercase mb-3 fw-bolder">
            PRINCIPLE {principalKey}: {getPrincipleTitle(principalKey)}
          </h4>
          {groupedBySectionAndPrincipal["C"][principalKey]?.map(({ keyName, question }, index) => {
            const answer = findKeyRecursively(companyData, keyName);
            return (
              <div key={index} className="mb-4">
                <strong>{index + 1}. {question}</strong>
                {renderNestedObject(answer)}
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
};

// Helper
const getPrincipleTitle = (key) => {
  switch (key) {
    case "1": return "Businesses should conduct and govern themselves with integrity...";
    case "2": return "Businesses should provide goods and services in a manner that is sustainable and safe.";
    case "3": return "Businesses should respect and promote the well-being of all employees...";
    case "4": return "Businesses should respect the interests of and be responsive to all its stakeholders.";
    case "5": return "Businesses should respect and promote human rights.";
    case "6": return "Businesses should respect and make efforts to protect and restore the environment.";
    case "7": return "Businesses, when engaging in influencing public and regulatory policy...";
    case "8": return "Businesses should promote inclusive growth and equitable development.";
    case "9": return "Businesses should engage with and provide value to their consumers...";
    default: return "";
  }
};

export default BRSRReportContent;