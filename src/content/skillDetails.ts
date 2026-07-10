/**
 * Deep-dive content for the Skills section overlay (§73–92 companion).
 * Each entry powers the modal that opens when a skill chip is clicked:
 * a plain-language summary, verified research papers and books to learn
 * from, official resources, and a Higgsfield-generated banner.
 *
 * Citations here are human/agent-verified — never fabricated. A skill with
 * no genuine academic literature (proprietary mainframe tooling, vendor
 * products) carries an empty `papers`/`books` array and leans on `resources`.
 */

export interface SkillPaper {
  title: string;
  authors: string;
  year?: number;
  venue?: string;
  url: string;
  note?: string;
}

export interface SkillBook {
  title: string;
  authors: string;
  year?: number;
  publisher?: string;
  url: string;
  note?: string;
}

export interface SkillResource {
  label: string;
  url: string;
}

export interface SkillDetail {
  category: string;
  /** Punchy one-liner, ≤ ~70 chars */
  tagline: string;
  /** 2–4 sentence plain-prose description of the topic */
  summary: string;
  papers: SkillPaper[];
  books: SkillBook[];
  resources: SkillResource[];
}

/** Filename/DOM-id slug for a tech name — matches the banner asset path. */
export function skillSlug(tech: string): string {
  return tech
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Verified deep-dive content, keyed by the exact tech label used in
 * `skills`. Populated from a researched + adversarially fact-checked pass;
 * a missing key falls back to the short `skillContext` tooltip.
 */
export const skillDetails: Record<string, SkillDetail> = {
  "COBOL": {
    "category": "Mainframe Core",
    "tagline": "1959 business language still powering banks and governments",
    "summary": "COBOL (Common Business-Oriented Language) is a compiled, deliberately English-like programming language created in 1959 for business data processing, with first-class support for record-oriented files, fixed-decimal arithmetic, and high-volume batch and transaction workloads. It remains the backbone of mainframe systems at banks, insurers, airlines, and government agencies, where an enormous installed base of code still runs core ledgers, payroll, and payment processing. Its verbose, self-documenting syntax and exact decimal math made it durable for financial computation, and modern compilers such as IBM Enterprise COBOL for z/OS and the open-source GnuCOBOL keep it interoperating with Db2, CICS, and web services. It matters because a large share of the world's daily financial transactions still pass through COBOL programs written decades ago.",
    "papers": [
      {
        "title": "The Early History of COBOL",
        "authors": "Jean E. Sammet",
        "year": 1978,
        "venue": "ACM SIGPLAN History of Programming Languages Conference (HOPL)",
        "url": "https://dl.acm.org/doi/10.1145/800025.1198367",
        "note": "First-hand account by a member of the original CODASYL effort; the canonical source on why COBOL is shaped the way it is."
      },
      {
        "title": "ISO/IEC 1989:2023 — Programming language COBOL",
        "authors": "ISO/IEC JTC 1/SC 22",
        "year": 2023,
        "venue": "International Organization for Standardization",
        "url": "https://www.iso.org/standard/74527.html",
        "note": "The current authoritative language standard defining COBOL syntax and semantics."
      }
    ],
    "books": [
      {
        "title": "Murach's Mainframe COBOL",
        "authors": "Mike Murach, Anne Prince, Raul Menendez",
        "year": 2004,
        "publisher": "Mike Murach & Associates",
        "url": "https://www.murach.com/shop/murachs-mainframe-cobol-detail",
        "note": "Practical, widely used training text for real z/OS COBOL including VSAM, CICS, and Db2."
      },
      {
        "title": "Beginning COBOL for Programmers",
        "authors": "Michael Coughlan",
        "year": 2014,
        "publisher": "Apress",
        "url": "https://link.springer.com/book/10.1007/978-1-4302-6254-1",
        "note": "Modern tutorial aimed at experienced programmers, covering ANS 85 features through object-oriented COBOL."
      }
    ],
    "resources": [
      {
        "label": "IBM Enterprise COBOL for z/OS — official documentation",
        "url": "https://www.ibm.com/docs/en/cobol-zos"
      },
      {
        "label": "GnuCOBOL — open-source COBOL compiler (GNU Project)",
        "url": "https://gnucobol.sourceforge.io/"
      },
      {
        "label": "ISO/IEC 1989:2023 COBOL standard (ISO catalogue)",
        "url": "https://www.iso.org/standard/74527.html"
      }
    ]
  },
  "JCL": {
    "category": "Mainframe Core",
    "tagline": "IBM's control language for defining and running mainframe batch jobs",
    "summary": "JCL (Job Control Language) is the control language used on IBM mainframe operating systems — z/OS and its predecessors MVS and OS/360 — to tell the system how to run batch jobs. Through its JOB, EXEC, and DD statements it specifies which programs to execute, the datasets they read and write, and the resources (memory, disk, execution order, and conditional logic) each job needs; it is a job-orchestration language interpreted by the job entry subsystem (JES2/JES3), not a language for computation. It matters because the bulk of enterprise batch workloads in banking, insurance, and government still run on z/OS, where JCL remains the standard way to schedule, parameterize, and manage that processing.",
    "papers": [],
    "books": [
      {
        "title": "zOS JCL (Job Control Language), 5th Edition",
        "authors": "Gary DeWard Brown",
        "year": 2002,
        "publisher": "John Wiley & Sons",
        "url": "https://www.wiley.com/en-us/zOS+JCL+(Job+Control+Language),+5th+Edition-p-9780471426738",
        "note": "The canonical JCL reference and tutorial, in print across five editions."
      },
      {
        "title": "Murach's OS/390 and z/OS JCL",
        "authors": "Raul Menendez, Doug Lowe",
        "year": 2002,
        "publisher": "Mike Murach & Associates",
        "url": "https://www.murach.com/shop/murach-s-os-390-and-z-os-jcl-detail",
        "note": "Widely used training-and-reference book covering JCL plus VSAM, utilities, and TSO."
      }
    ],
    "resources": [
      {
        "label": "IBM z/OS MVS JCL Reference (SA23-1385)",
        "url": "https://www.ibm.com/docs/en/zos/3.1.0?topic=mvs-zos-jcl-reference"
      },
      {
        "label": "IBM z/OS MVS JCL User's Guide (SA23-1386, PDF)",
        "url": "https://www.ibm.com/docs/en/SSLTBW_3.1.0/pdf/ieab500_v3r1.pdf"
      }
    ]
  },
  "CICS": {
    "category": "Mainframe Core",
    "tagline": "IBM's transaction processing monitor for the z/OS mainframe",
    "summary": "CICS (Customer Information Control System) is IBM's transaction processing monitor and mixed-language application server for the z/OS mainframe, first shipped in 1969 and still actively developed as CICS Transaction Server. It manages high-volume, short-lived online transactions with ACID guarantees, brokering the interaction between terminals or remote clients and business logic written in COBOL, PL/I, C, Assembler, Java, and Node.js. It matters because a large share of the world's banking, insurance, airline, and retail transactions still flow through CICS regions, where its scheduling, resource management, and recoverable-unit-of-work model deliver the throughput, integrity, and availability those systems depend on.",
    "papers": [
      {
        "title": "Principles of Transaction-Oriented Database Recovery",
        "authors": "Theo Haerder, Andreas Reuter",
        "year": 1983,
        "venue": "ACM Computing Surveys, 15(4), 287-317",
        "url": "https://dl.acm.org/doi/10.1145/289.291",
        "note": "The paper that coined ACID; explains the transactional recovery and integrity guarantees a monitor like CICS is built to enforce"
      }
    ],
    "books": [
      {
        "title": "Designing and Programming CICS Applications",
        "authors": "John Horswill and members of the CICS Development Team at IBM",
        "year": 2000,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/designing-and-programming/9781449311933/",
        "note": "Practical, step-by-step introduction to writing and structuring CICS applications, still the canonical learner's text"
      }
    ],
    "resources": [
      {
        "label": "IBM CICS Transaction Server for z/OS documentation",
        "url": "https://www.ibm.com/docs/en/cics-ts"
      },
      {
        "label": "IBM CICS Transaction Server product page",
        "url": "https://www.ibm.com/products/cics-transaction-server"
      },
      {
        "label": "IBM Redbook: CICS Transaction Server from Start to Finish (SG24-7952)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg247952.html"
      }
    ]
  },
  "DB2": {
    "category": "Mainframe Core",
    "tagline": "IBM's flagship relational database, born on the mainframe",
    "summary": "DB2 (now branded Db2) is IBM's family of relational database management systems, first released in 1983 for MVS mainframes and descended directly from IBM's pioneering System R research project. On z/OS it serves as the system of record for a large share of the world's banking, insurance, airline, and government transaction workloads, storing data in SQL tables and processing high-volume OLTP and batch through features like data sharing across a Parallel Sysplex, a cost-based query optimizer, and deep integration with CICS and IMS. It matters because it is one of the original commercial SQL databases and remains a core, extraordinarily durable piece of enterprise infrastructure, prized for transactional integrity, throughput, and availability at scale. The DB2 brand also spans Linux, UNIX, and Windows (Db2 LUW) and IBM i, but on the mainframe Db2 for z/OS is the canonical enterprise data platform.",
    "papers": [
      {
        "title": "A Relational Model of Data for Large Shared Data Banks",
        "authors": "E. F. Codd",
        "year": 1970,
        "venue": "Communications of the ACM, 13(6), 377-387",
        "url": "https://doi.org/10.1145/362384.362685",
        "note": "The foundational paper defining the relational model that DB2 implements."
      },
      {
        "title": "System R: Relational Approach to Database Management",
        "authors": "M. M. Astrahan, M. W. Blasgen, D. D. Chamberlin, K. P. Eswaran, J. N. Gray, et al.",
        "year": 1976,
        "venue": "ACM Transactions on Database Systems, 1(2), 97-137",
        "url": "https://doi.org/10.1145/320455.320457",
        "note": "The IBM research prototype that DB2 is the direct commercial descendant of."
      },
      {
        "title": "Access Path Selection in a Relational Database Management System",
        "authors": "P. G. Selinger, M. M. Astrahan, D. D. Chamberlin, R. A. Lorie, T. G. Price",
        "year": 1979,
        "venue": "Proceedings of the 1979 ACM SIGMOD Conference, 23-34",
        "url": "https://doi.org/10.1145/582095.582099",
        "note": "The seminal cost-based query optimizer design that underpins DB2's optimizer."
      }
    ],
    "books": [
      {
        "title": "DB2 Developer's Guide: A Solutions-Oriented Approach to Learning the Foundation and Capabilities of DB2 for z/OS",
        "authors": "Craig S. Mullins",
        "year": 2012,
        "publisher": "IBM Press (6th edition)",
        "url": "https://www.mullinsconsulting.com/ddg.html",
        "note": "The standard reference for programming and administering DB2 on z/OS."
      }
    ],
    "resources": [
      {
        "label": "IBM Db2 for z/OS documentation (IBM Documentation)",
        "url": "https://www.ibm.com/docs/en/db2-for-zos"
      },
      {
        "label": "IBM Db2 database product documentation portal",
        "url": "https://www.ibm.com/docs/en/db2"
      },
      {
        "label": "IBM Redbook: IBM Db2 13 for z/OS and More (SG24-8527)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg248527.html"
      }
    ]
  },
  "VSAM": {
    "category": "Mainframe Core",
    "tagline": "IBM's indexed, record-oriented file access method for z/OS",
    "summary": "VSAM (Virtual Storage Access Method) is an IBM disk file storage and access method, introduced in the 1970s, used on z/OS and its predecessors to organize and retrieve records in mainframe datasets. It offers several dataset organizations — key-sequenced (KSDS), entry-sequenced (ESDS), relative-record (RRDS), and linear (LDS) — giving programs keyed, sequential, and direct record access, along with alternate indexes and record-level sharing, without requiring a full database manager. It is the workhorse storage layer beneath decades of high-volume batch and online (CICS/IMS) business systems. It matters because mission-critical banking, insurance, and government applications still keep their transactional data in VSAM datasets, so understanding it is essential to maintaining and modernizing mainframe workloads.",
    "papers": [],
    "books": [
      {
        "title": "VSAM for the COBOL Programmer",
        "authors": "Doug Lowe",
        "year": 1989,
        "publisher": "Mike Murach & Associates",
        "url": "https://www.amazon.com/VSAM-COBOL-Programmer-Doug-Lowe/dp/0911625453",
        "note": "Classic hands-on guide to reading and writing VSAM datasets from COBOL, including IDCAMS and JCL."
      }
    ],
    "resources": [
      {
        "label": "IBM Redbook: VSAM Demystified (SG24-6105)",
        "url": "http://www.redbooks.ibm.com/abstracts/sg246105.html"
      },
      {
        "label": "IBM z/OS DFSMS Using Data Sets (SC23-6855)",
        "url": "https://www.ibm.com/docs/en/SSLTBW_3.1.0/pdf/idad400_v3r1.pdf"
      }
    ]
  },
  "IMS DB": {
    "category": "Mainframe Core",
    "tagline": "IBM's hierarchical mainframe database, running since the Apollo era",
    "summary": "IMS DB is the database component of IBM's Information Management System, a hierarchical database originally built in 1966-1968 for the Apollo program's bill-of-materials and now a core part of the z/OS mainframe stack. It stores data as fixed parent-child segment hierarchies accessed through the DL/I (Data Language One) API rather than SQL, delivering very high throughput and low, predictable latency for transaction workloads. Paired with IMS TM (its Transaction Manager), it still underpins mission-critical systems at most large banks, insurers, and government agencies, processing tens of billions of transactions per day. It matters because decades of financial and industrial records live in IMS, and its performance and reliability keep it in production long after relational databases became the default.",
    "papers": [
      {
        "title": "The information management system IMS/VS, Part I: General structure and operation",
        "authors": "William C. McGee",
        "year": 1977,
        "venue": "IBM Systems Journal, Vol. 16, No. 2",
        "url": "https://ieeexplore.ieee.org/document/5388074/",
        "note": "The definitive contemporaneous technical description of IMS by IBM, covering its hierarchical segment structures, storage organizations, and DL/I access."
      },
      {
        "title": "A Relational Model of Data for Large Shared Data Banks",
        "authors": "E. F. Codd",
        "year": 1970,
        "venue": "Communications of the ACM, Vol. 13, No. 6",
        "url": "https://doi.org/10.1145/362384.362685",
        "note": "The landmark paper proposing the relational model against navigational/hierarchical systems like IMS; essential context for understanding IMS's hierarchical tradeoffs."
      }
    ],
    "books": [
      {
        "title": "An Introduction to IMS: Your Complete Guide to IBM Information Management System (2nd Edition)",
        "authors": "Barbara Klein, Richard Alan Long, Kenneth Ray Blackman, Diane Lynne Goff, et al.",
        "year": 2012,
        "publisher": "IBM Press / Pearson",
        "url": "https://www.informit.com/store/introduction-to-ims-your-complete-guide-to-ibm-information-9780132886871"
      }
    ],
    "resources": [
      {
        "label": "IBM IMS product documentation (IBM Docs)",
        "url": "https://www.ibm.com/docs/en/ims"
      },
      {
        "label": "IMS Primer (IBM Redbook SG24-5352)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg245352.html"
      },
      {
        "label": "IBM IMS product homepage",
        "url": "https://www.ibm.com/products/ims"
      }
    ]
  },
  "Z/OS": {
    "category": "Mainframe Core",
    "tagline": "IBM's flagship mainframe OS for mission-critical enterprise workloads",
    "summary": "z/OS is IBM's 64-bit operating system for its IBM Z mainframes, the direct descendant of the OS/360 and MVS lineage that has evolved continuously since the 1960s. It runs high-volume, mission-critical transaction and batch workloads for banks, insurers, airlines, and governments, typically hosting subsystems such as CICS, Db2, IMS, and MQ under strict service-level agreements. Its defining strengths are extreme reliability, availability, and serviceability (RAS), massive I/O throughput, hardware-enforced workload isolation, and Workload Manager-driven resource allocation that keeps thousands of concurrent jobs meeting their goals. Backward compatibility is a core design principle, so decades-old application binaries generally still run unchanged on current hardware.",
    "papers": [
      {
        "title": "Architecture of the IBM System/360",
        "authors": "G. M. Amdahl, G. A. Blaauw, F. P. Brooks Jr.",
        "year": 1964,
        "venue": "IBM Journal of Research and Development, vol. 8, no. 2, pp. 87-101",
        "url": "https://doi.org/10.1147/rd.82.0087",
        "note": "The seminal paper defining the System/360 architecture that z/Architecture and z/OS directly descend from; explains the compatibility and generality principles still central to the platform."
      }
    ],
    "books": [
      {
        "title": "Introduction to the New Mainframe: z/OS Basics",
        "authors": "Mike Ebbers, John Kettner, Wayne O'Brien, Bill Ogden",
        "year": 2011,
        "publisher": "IBM Redbooks (SG24-6366-02)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg246366.html",
        "note": "The canonical, freely available introductory textbook to z/OS concepts, architecture, and system programming basics."
      }
    ],
    "resources": [
      {
        "label": "IBM z/OS product documentation (IBM Docs)",
        "url": "https://www.ibm.com/docs/en/zos"
      },
      {
        "label": "z/Architecture Principles of Operation (SA22-7832) — official spec",
        "url": "https://publibfp.dhe.ibm.com/epubs/pdf/a227832d.pdf"
      },
      {
        "label": "IBM Redbooks — mainframe and z/OS technical library",
        "url": "https://www.redbooks.ibm.com/"
      }
    ]
  },
  "TSO": {
    "category": "Mainframe Core",
    "tagline": "IBM's interactive time-sharing shell for z/OS mainframes",
    "summary": "TSO (Time Sharing Option, shipped as TSO/E, Time Sharing Option/Extensions) is the core interactive facility of IBM's z/OS operating system that gives each user a single-user logon session and a command-line interface to the mainframe. From a TSO session an operator can enter commands to manage data sets, submit and monitor batch jobs, edit files, run REXX and CLIST scripts, and invoke full-screen applications such as ISPF. It is the primary way developers and system programmers work interactively on z/OS, and because it underpins ISPF and much of the day-to-day mainframe workflow, TSO literacy is foundational for anyone operating or developing on the platform.",
    "papers": [],
    "books": [
      {
        "title": "Introduction to the New Mainframe: z/OS Basics",
        "authors": "Mike Ebbers, John Kettner, Wayne O'Brien, Bill Ogden (IBM Redbooks)",
        "year": 2011,
        "publisher": "IBM Redbooks",
        "url": "https://www.redbooks.ibm.com/abstracts/sg246366.html",
        "note": "Standard beginner text (SG24-6366); dedicated chapters cover TSO/E and ISPF interactive facilities."
      }
    ],
    "resources": [
      {
        "label": "What is TSO? - IBM z/OS Basic Skills Documentation",
        "url": "https://www.ibm.com/docs/en/zos-basic-skills?topic=interfaces-what-is-tso"
      },
      {
        "label": "z/OS TSO/E Command Reference (IBM Documentation)",
        "url": "https://www.ibm.com/docs/en/zos/3.1.0?topic=reference-tsoe-commands"
      },
      {
        "label": "IBM Redbook: Introduction to the New Mainframe: z/OS Basics (SG24-6366)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg246366.html"
      }
    ]
  },
  "ISPF": {
    "category": "Mainframe Core",
    "tagline": "The full-screen panel interface mainframe developers live in on z/OS",
    "summary": "ISPF (Interactive System Productivity Facility) is IBM's menu-driven, full-screen application that runs under TSO/E on z/OS, providing programmers and system administrators the primary 3270-terminal interface to the mainframe. Its core pieces are a powerful text editor (the ISPF Editor with edit macros), dataset and library management utilities (the Program Development Facility, or PDF), and a Dialog Manager framework for building panel-based applications driven by REXX or CLIST. Introduced in the mid-1970s, it has remained the day-to-day workbench for editing source, browsing and managing datasets, submitting and monitoring jobs, and navigating the system. Fluency in ISPF is a baseline skill for essentially all mainframe development and operations work.",
    "papers": [],
    "books": [
      {
        "title": "Murach's MVS TSO: Concepts and ISPF, Part 1",
        "authors": "Doug Lowe",
        "year": 1991,
        "publisher": "Mike Murach & Associates",
        "url": "https://www.murach.com/shop/mvs-tso-2c-part-1-concepts-and-ispf-detail",
        "note": "Classic hands-on introduction to TSO and ISPF for everyday mainframe programming tasks."
      }
    ],
    "resources": [
      {
        "label": "IBM Documentation: ISPF for z/OS (product landing page)",
        "url": "https://www.ibm.com/docs/en/zos/3.1.0?topic=ispf"
      },
      {
        "label": "z/OS ISPF User's Guide Volume I (official PDF, z/OS 3.1)",
        "url": "https://www.ibm.com/docs/en/SSLTBW_3.1.0/pdf/f54ug00_v3r1.pdf"
      },
      {
        "label": "IBM Redbook: ABCs of z/OS System Programming Volume 1 (covers TSO/E and ISPF)",
        "url": "https://www.redbooks.ibm.com/redbooks/pdfs/sg246981.pdf"
      }
    ]
  },
  "QMF": {
    "category": "Mainframe Core",
    "tagline": "IBM's SQL query, reporting, and visualization tool for Db2",
    "summary": "QMF (Query Management Facility) is IBM's long-established query, reporting, and data-visualization tool for Db2, first shipped in the 1980s and still developed today (currently version 13). It lets analysts and business users run SQL, prompted, or QBE-style queries against Db2 for z/OS and other relational and non-relational sources, then format the results into saved reports, charts, and dashboards that can be scheduled and shared. It is used for both ad hoc querying and production reporting on mainframe data, packaged in variants such as QMF for TSO/CICS, QMF for Workstation, and QMF for WebSphere. It matters because it remains one of the most widely deployed end-user data-access tools in the IBM Z ecosystem, giving non-programmers governed, security-rich access to enterprise data without moving it off the mainframe.",
    "papers": [],
    "books": [],
    "resources": [
      {
        "label": "IBM Db2 Query Management Facility (QMF) — product page",
        "url": "https://www.ibm.com/products/db2-qmf"
      },
      {
        "label": "DB2 Query Management Facility — IBM Documentation",
        "url": "https://www.ibm.com/docs/en/qmf"
      },
      {
        "label": "IBM Redbook SG24-8012: Complete Analytics with IBM DB2 Query Management Facility",
        "url": "https://www.redbooks.ibm.com/abstracts/sg248012.html"
      }
    ]
  },
  "SPUFI": {
    "category": "Mainframe Core",
    "tagline": "Run SQL interactively against Db2 for z/OS from an ISPF dataset",
    "summary": "SPUFI (SQL Processor Using File Input) is an interactive facility within DB2I, the Db2 for z/OS panel interface that runs under ISPF/TSO. It lets a developer or DBA type SQL statements into an edited input dataset, submit them to Db2 for dynamic preparation and execution, and read the results and SQLCODE feedback in an output dataset. It is the classic, no-programming way to test SQL, inspect table contents, run DDL/DML, and validate queries before embedding them in COBOL, PL/I, or other application programs, which makes it a foundational everyday tool for anyone doing Db2 work on the mainframe.",
    "papers": [],
    "books": [
      {
        "title": "DB2 Developer's Guide: A Solutions-Oriented Approach to Learning the Foundation and Capabilities of DB2 for z/OS",
        "authors": "Craig S. Mullins",
        "year": 2012,
        "publisher": "IBM Press / Pearson",
        "url": "https://www.informit.com/store/db2-developers-guide-a-solutions-oriented-approach-9780132836425",
        "note": "The standard reference on Db2 for z/OS development; covers SPUFI and the DB2I interactive tools in depth."
      }
    ],
    "resources": [
      {
        "label": "IBM Documentation - Executing SQL by using SPUFI (Db2 13 for z/OS)",
        "url": "https://www.ibm.com/docs/en/db2-for-zos/13?topic=zos-executing-sql-by-using-spufi"
      },
      {
        "label": "IBM Db2 12 for z/OS Application Programming and SQL Guide (PDF, covers SPUFI and DB2I)",
        "url": "https://www.ibm.com/docs/en/SSEPEK_12.0.0/pdf/db2z_12_apsgbook.pdf"
      },
      {
        "label": "IBM Redbook - IBM Db2 13 for z/OS and More (SG24-8527)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg248527.html"
      }
    ]
  },
  "Endevor": {
    "category": "Mainframe Core",
    "tagline": "Software change and configuration management for z/OS mainframes",
    "summary": "Endevor (Broadcom Endevor Software Change Manager, formerly CA Endevor) is a source-code and configuration management system for IBM z/OS mainframes. It secures, tracks, and automates changes to software inventory across lifecycle stages, controlling how elements (source, load modules, JCL, etc.) are added, updated, generated, and promoted from development into production. Packages group and gate element actions with approvals, while automated generate/build processing, an online change history, and footprinting let teams know exactly what changed, by whom, and why. It matters because it brings disciplined version control, auditability, and repeatable, compliant deployment to large legacy mainframe codebases that predate modern DevOps tooling.",
    "papers": [],
    "books": [],
    "resources": [
      {
        "label": "Broadcom TechDocs — Endevor Software Change Manager 19.0 (official documentation)",
        "url": "https://techdocs.broadcom.com/us/en/ca-mainframe-software/devops/ca-endevor-software-change-manager/19-0.html"
      },
      {
        "label": "Endevor — Understanding Software Development Change Control (concepts)",
        "url": "https://techdocs.broadcom.com/us/en/ca-mainframe-software/devops/ca-endevor-software-change-manager/19-0/administrating/understanding-software-development-change-control.html"
      },
      {
        "label": "IBM Documentation — Accessing source files in CA Endevor SCM (IDz integration)",
        "url": "https://www.ibm.com/docs/en/developer-for-zos/16.0.x?topic=workspace-from-ca-endevor-software-change-manager-scm"
      }
    ]
  },
  "ChangeMan": {
    "category": "Mainframe Core",
    "tagline": "Automated change management for IBM z/OS mainframe software",
    "summary": "ChangeMan ZMF is an enterprise software change and configuration management (SCM) system for the IBM z/OS mainframe, historically from Serena Software and now sold by Rocket Software (after passing through Micro Focus and OpenText). It controls the full lifecycle of mainframe code and related components—versioning source, tracking every change, and orchestrating promotion through development, test, and production with audit, approval, and rollback controls. Teams use it to enforce separation of duties, guarantee that what runs in production is exactly what was tested, and satisfy regulatory and audit requirements for mission-critical COBOL/PL/I/assembler applications. It matters because large financial, insurance, and government systems still run on z/OS, where disciplined, auditable change control is essential to avoid outages and compliance failures.",
    "papers": [],
    "books": [],
    "resources": [
      {
        "label": "Rocket ChangeMan ZMF — official product page",
        "url": "https://www.rocketsoftware.com/en-us/products/changeman/changeman-zmf"
      },
      {
        "label": "ChangeMan ZMF documentation library (Rocket Software)",
        "url": "https://docs.rocketsoftware.com/bundle?cluster=true&labelkey=prod_changeman_zmf"
      },
      {
        "label": "Guide to ChangeMan ZMF Documentation",
        "url": "https://docs.rocketsoftware.com/bundle/changemanzmf_rest_gs_831/page/welcome/guide-to-changeman-zmf-documentation.html"
      }
    ]
  },
  "IBM Utilities": {
    "category": "Mainframe Core",
    "tagline": "IBM-supplied z/OS system programs for routine dataset management",
    "summary": "IBM Utilities are the standard, IBM-supplied system utility programs that ship with z/OS and are invoked through JCL to perform routine data- and dataset-management tasks. The core set includes the DFSMSdfp utilities such as IEBGENER (copy/generate sequential data), IEBCOPY (copy, compress, and merge partitioned data sets), IDCAMS (Access Method Services for VSAM and catalogs), and IEFBR14 (a \"do-nothing\" program used to allocate or delete data sets), alongside the DFSORT sort/merge utility and its ICETOOL front end. Mainframe and system programmers rely on them for everyday batch work — backing up and restoring files, reformatting records, cataloging and listing data sets, and sorting or summarizing large files — without writing custom application code. They matter because they are the ubiquitous, pre-installed building blocks of virtually every z/OS batch job, so fluency with them is foundational to working on the platform.",
    "papers": [],
    "books": [
      {
        "title": "Murach's OS/390 and z/OS JCL",
        "authors": "Raul Menendez, Doug Lowe",
        "year": 2002,
        "publisher": "Mike Murach & Associates",
        "url": "https://www.murach.com/shop/murach-s-os-390-and-z-os-jcl-detail",
        "note": "Classic JCL text with extensive coverage of OS utility programs, Access Method Services (IDCAMS), and the sort/merge utility."
      }
    ],
    "resources": [
      {
        "label": "z/OS DFSMSdfp Utilities (IBM SC23-6864) — official reference for IEBGENER, IEBCOPY, IDCAMS, IEHLIST and the IEB/IEH utilities",
        "url": "https://www.ibm.com/docs/en/SSLTBW_2.5.0/pdf/idau100_v2r5.pdf"
      },
      {
        "label": "z/OS DFSORT Application Programming Guide (IBM SC23-6878) — the sort/merge/copy utility and ICETOOL",
        "url": "https://www.ibm.com/docs/en/SSLTBW_2.5.0/pdf/icea100_v2r5.pdf"
      },
      {
        "label": "IBM Redbook: ABCs of IBM z/OS System Programming Volume 1 (SG24-6981)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg246981.html"
      }
    ]
  },
  "Python": {
    "category": "Modern Stack",
    "tagline": "High-level, dynamically typed language built for readability",
    "summary": "Python is a high-level, dynamically typed, interpreted programming language created by Guido van Rossum in 1991, designed around readability and a clean, indentation-based syntax. It is general-purpose and spans web backends (Django, FastAPI), data science and machine learning (NumPy, pandas, PyTorch), automation, scripting, and DevOps tooling. Its \"batteries-included\" standard library plus the massive PyPI ecosystem let developers move from prototype to production quickly, which is why it has become the default language for data and AI work. Its multi-paradigm design and gentle learning curve also make it one of the most widely taught first languages.",
    "papers": [
      {
        "title": "Python for Scientific Computing",
        "authors": "Travis E. Oliphant",
        "year": 2007,
        "venue": "Computing in Science & Engineering, vol. 9, no. 3 (IEEE)",
        "url": "https://doi.org/10.1109/MCSE.2007.58",
        "note": "Widely cited overview of why Python became the backbone of scientific and numerical computing."
      },
      {
        "title": "PEP 8 – Style Guide for Python Code",
        "authors": "Guido van Rossum, Barry Warsaw, Alyssa Coghlan",
        "year": 2001,
        "venue": "Python Enhancement Proposals (python.org)",
        "url": "https://peps.python.org/pep-0008/",
        "note": "The official style standard that defines idiomatic, readable Python."
      },
      {
        "title": "PEP 20 – The Zen of Python",
        "authors": "Tim Peters",
        "year": 2004,
        "venue": "Python Enhancement Proposals (python.org)",
        "url": "https://peps.python.org/pep-0020/",
        "note": "The 19 aphorisms that capture Python's design philosophy of clarity and simplicity."
      }
    ],
    "books": [
      {
        "title": "Fluent Python (2nd Edition)",
        "authors": "Luciano Ramalho",
        "year": 2022,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/fluent-python-2nd/9781492056348/",
        "note": "Deep dive into idiomatic, Pythonic code and the data model for intermediate/advanced developers."
      },
      {
        "title": "Python Crash Course (3rd Edition)",
        "authors": "Eric Matthes",
        "year": 2023,
        "publisher": "No Starch Press",
        "url": "https://nostarch.com/python-crash-course-3rd-edition",
        "note": "A best-selling, project-based introduction for newcomers to the language."
      },
      {
        "title": "Automate the Boring Stuff with Python (2nd Edition)",
        "authors": "Al Sweigart",
        "year": 2019,
        "publisher": "No Starch Press",
        "url": "https://automatetheboringstuff.com/",
        "note": "Free canonical online edition focused on practical scripting and automation."
      }
    ],
    "resources": [
      {
        "label": "Official Python Documentation",
        "url": "https://docs.python.org/3/"
      },
      {
        "label": "The Python Language Reference",
        "url": "https://docs.python.org/3/reference/"
      },
      {
        "label": "Python.org (official homepage)",
        "url": "https://www.python.org/"
      }
    ]
  },
  "Java": {
    "category": "Modern Stack",
    "tagline": "Statically typed, JVM-based language built to run anywhere",
    "summary": "Java is a class-based, statically typed, object-oriented language that compiles to platform-neutral bytecode run by the Java Virtual Machine (JVM), giving it the \"write once, run anywhere\" portability that made it ubiquitous. It is a workhorse for large-scale backend and enterprise systems, Android apps, big-data tooling (Hadoop, Spark, Kafka), and financial and cloud infrastructure, backed by a vast standard library and mature ecosystem (Spring, Jakarta EE, Maven/Gradle). Its managed memory with garbage collection, strong tooling, backward compatibility, and a battle-tested JIT-compiled runtime (HotSpot) let teams ship performant, maintainable software at scale. Now on a six-month release cadence with modern features like records, sealed types, pattern matching, and virtual threads, it remains one of the most widely deployed languages in production.",
    "papers": [
      {
        "title": "The Java Language Specification, Java SE 21 Edition",
        "authors": "James Gosling, Bill Joy, Guy Steele, Gilad Bracha, Alex Buckley, Daniel Smith, Gavin Bierman",
        "year": 2023,
        "venue": "Oracle America, Inc. (official language specification)",
        "url": "https://docs.oracle.com/javase/specs/jls/se21/html/index.html",
        "note": "The authoritative definition of Java's syntax, type system, and semantics."
      },
      {
        "title": "The Java Virtual Machine Specification, Java SE 21 Edition",
        "authors": "Tim Lindholm, Frank Yellin, Gilad Bracha, Alex Buckley, Daniel Smith",
        "year": 2023,
        "venue": "Oracle America, Inc. (official specification)",
        "url": "https://docs.oracle.com/javase/specs/jvms/se21/html/index.html",
        "note": "Defines the bytecode format, class file structure, and JVM execution model underlying Java."
      }
    ],
    "books": [
      {
        "title": "Effective Java, 3rd Edition",
        "authors": "Joshua Bloch",
        "year": 2018,
        "publisher": "Addison-Wesley Professional (Pearson)",
        "url": "https://www.pearson.com/en-us/subject-catalog/p/effective-java/P200000000138/9780134686042",
        "note": "The canonical guide to idiomatic, robust Java by a lead designer of the platform libraries."
      },
      {
        "title": "Java Concurrency in Practice",
        "authors": "Brian Goetz, Tim Peierls, Joshua Bloch, Joseph Bowbeer, David Holmes, Doug Lea",
        "year": 2006,
        "publisher": "Addison-Wesley Professional",
        "url": "https://www.oreilly.com/library/view/java-concurrency-in/0321349601/",
        "note": "The definitive treatment of the Java memory model and writing correct concurrent code."
      }
    ],
    "resources": [
      {
        "label": "Java SE Specifications (Oracle, JLS & JVMS, all versions)",
        "url": "https://docs.oracle.com/javase/specs/"
      },
      {
        "label": "OpenJDK — the open-source reference implementation",
        "url": "https://openjdk.org/"
      },
      {
        "label": "dev.java — official Java developer portal and tutorials",
        "url": "https://dev.java/"
      }
    ]
  },
  "C++": {
    "category": "Modern Stack",
    "tagline": "Compiled systems language with zero-overhead abstractions",
    "summary": "C++ is a statically typed, compiled, general-purpose programming language created by Bjarne Stroustrup as an extension of C, adding object-oriented programming, generic programming via templates, and RAII-based resource management. It gives direct control over memory and hardware while offering high-level abstractions that compile down with little to no runtime overhead, which is why it dominates performance-critical domains: operating systems, game engines, browsers, databases, high-frequency trading, and embedded systems. Standardized by ISO (with major revisions in C++11, C++14, C++17, C++20, and C++23), it keeps evolving with modern features like move semantics, lambdas, concepts, and coroutines. Its combination of speed, portability, and expressiveness keeps it foundational to systems software decades after its creation.",
    "papers": [
      {
        "title": "A History of C++: 1979-1991",
        "authors": "Bjarne Stroustrup",
        "year": 1993,
        "venue": "ACM SIGPLAN Notices / HOPL-II",
        "url": "https://doi.org/10.1145/155360.155375",
        "note": "The creator's account of the language's origins, design goals, and the constraints that shaped it"
      },
      {
        "title": "Evolving a language in and for the real world: C++ 1991-2006",
        "authors": "Bjarne Stroustrup",
        "year": 2007,
        "venue": "ACM HOPL-III",
        "url": "https://doi.org/10.1145/1238844.1238848",
        "note": "Traces the standardization era and design rationale behind modern C++ features"
      },
      {
        "title": "ISO/IEC 14882:2024 - Programming languages - C++",
        "authors": "ISO/IEC JTC1/SC22/WG21",
        "year": 2024,
        "venue": "ISO/IEC",
        "url": "https://www.iso.org/standard/83626.html",
        "note": "The authoritative language specification defining C++ semantics and the standard library"
      }
    ],
    "books": [
      {
        "title": "The C++ Programming Language (4th Edition)",
        "authors": "Bjarne Stroustrup",
        "year": 2013,
        "publisher": "Addison-Wesley",
        "url": "https://www.informit.com/store/c-plus-plus-programming-language-9780321563842",
        "note": "The definitive reference from the language's creator, covering C++11 comprehensively"
      },
      {
        "title": "Effective Modern C++",
        "authors": "Scott Meyers",
        "year": 2014,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/effective-modern-c/9781491908419/",
        "note": "42 specific ways to use C++11 and C++14 idiomatically and correctly"
      },
      {
        "title": "A Tour of C++ (3rd Edition)",
        "authors": "Bjarne Stroustrup",
        "year": 2022,
        "publisher": "Addison-Wesley",
        "url": "https://www.informit.com/store/tour-of-c-plus-plus-9780136816485",
        "note": "A concise, fast-paced overview of modern C++ through C++20 for experienced programmers"
      }
    ],
    "resources": [
      {
        "label": "Standard C++ Foundation (isocpp.org)",
        "url": "https://isocpp.org/"
      },
      {
        "label": "cppreference.com - C++ language and library reference",
        "url": "https://en.cppreference.com/w/"
      },
      {
        "label": "ISO/IEC 14882 C++ standard",
        "url": "https://www.iso.org/standard/83626.html"
      }
    ]
  },
  "JavaScript": {
    "category": "Modern Stack",
    "tagline": "The dynamic language that runs the interactive web",
    "summary": "JavaScript is a high-level, dynamically typed, prototype-based scripting language standardized as ECMAScript, originally created in 1995 to make web pages interactive. It runs everywhere: in every browser via engines like V8 and SpiderMonkey, on servers through Node.js and Deno, and in mobile, desktop, and edge environments. Its single-threaded, event-driven model with first-class functions, closures, and asynchronous promises/async-await makes it the backbone of modern front-end frameworks (React, Vue, Svelte) and full-stack development. It matters because it is the only language natively executed by web browsers, making it effectively ubiquitous and one of the most widely used programming languages in the world.",
    "papers": [
      {
        "title": "The Essence of JavaScript",
        "authors": "Arjun Guha, Claudiu Saftoiu, Shriram Krishnamurthi",
        "year": 2010,
        "venue": "ECOOP 2010 (LNCS 6183, Springer)",
        "url": "https://link.springer.com/chapter/10.1007/978-3-642-14107-2_7",
        "note": "Reduces JavaScript to a small, tractable core calculus with operational semantics — the reference for understanding the language's real behavior and quirks."
      },
      {
        "title": "ECMAScript 2026 Language Specification (ECMA-262, 17th edition)",
        "authors": "Ecma International, TC39",
        "year": 2026,
        "venue": "Ecma International",
        "url": "https://262.ecma-international.org/",
        "note": "The authoritative standard that formally defines JavaScript's syntax, semantics, and built-in objects."
      }
    ],
    "books": [
      {
        "title": "JavaScript: The Definitive Guide (7th Edition)",
        "authors": "David Flanagan",
        "year": 2020,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/javascript-the-definitive/9781491952016/",
        "note": "Comprehensive, authoritative reference covering the language and web platform APIs."
      },
      {
        "title": "Eloquent JavaScript (4th Edition)",
        "authors": "Marijn Haverbeke",
        "year": 2024,
        "publisher": "No Starch Press",
        "url": "https://eloquentjavascript.net/",
        "note": "Modern introduction to programming with JavaScript; full text free online."
      },
      {
        "title": "You Don't Know JS Yet (2nd Edition)",
        "authors": "Kyle Simpson",
        "year": 2020,
        "publisher": "Independently published / GetiPub",
        "url": "https://github.com/getify/You-Dont-Know-JS",
        "note": "Deep dive into the language's core mechanisms; freely readable on GitHub."
      }
    ],
    "resources": [
      {
        "label": "MDN Web Docs — JavaScript",
        "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
      },
      {
        "label": "ECMA-262 Standard (Ecma International)",
        "url": "https://ecma-international.org/publications-and-standards/standards/ecma-262/"
      },
      {
        "label": "TC39 — ECMAScript Living Specification",
        "url": "https://tc39.es/ecma262/"
      }
    ]
  },
  "HTML": {
    "category": "Modern Stack",
    "tagline": "The markup language that structures every page on the web",
    "summary": "HTML (HyperText Markup Language) is the standard markup language for describing the structure and content of web documents, using nested elements and attributes to mark up text, links, images, forms, and media. Browsers parse HTML into the Document Object Model (DOM), which CSS then styles and JavaScript manipulates, making it the foundational layer of virtually every website and web application. Modern HTML (the WHATWG \"Living Standard,\" commonly called HTML5) adds semantic elements, native audio/video, canvas, and rich form controls, and emphasizes accessibility and cross-browser interoperability. It matters because it is the universal, backward-compatible contract every browser agrees to render, so competent HTML is a prerequisite for building anything on the web.",
    "papers": [
      {
        "title": "Hypertext Markup Language - 2.0 (RFC 1866)",
        "authors": "T. Berners-Lee, D. Connolly",
        "year": 1995,
        "venue": "IETF / RFC Editor",
        "url": "https://www.rfc-editor.org/rfc/rfc1866",
        "note": "The first formal IETF specification of HTML, defining its core grammar and the text/html media type."
      },
      {
        "title": "Information Management: A Proposal",
        "authors": "Tim Berners-Lee",
        "year": 1989,
        "venue": "CERN",
        "url": "https://www.w3.org/History/1989/proposal.html",
        "note": "The original proposal that introduced hypertext linking and led directly to HTML and the World Wide Web."
      }
    ],
    "books": [
      {
        "title": "HTML and CSS: Design and Build Websites",
        "authors": "Jon Duckett",
        "year": 2011,
        "publisher": "Wiley",
        "url": "https://www.wiley.com/en-us/HTML+and+CSS:+Design+and+Build+Websites-p-9781118206911",
        "note": "A widely used, visually driven introduction to writing HTML and CSS for beginners."
      },
      {
        "title": "Learning Web Design",
        "authors": "Jennifer Niederst Robbins",
        "year": 2018,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/learning-web-design/9781491960196/",
        "note": "A thorough, beginner-friendly grounding in HTML, CSS, and modern web design fundamentals."
      }
    ],
    "resources": [
      {
        "label": "HTML Living Standard (WHATWG) — the authoritative HTML specification",
        "url": "https://html.spec.whatwg.org/multipage/"
      },
      {
        "label": "MDN Web Docs: HTML reference and guides",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTML"
      },
      {
        "label": "W3C HTML working group and standards",
        "url": "https://www.w3.org/html/"
      }
    ]
  },
  "CSS": {
    "category": "Modern Stack",
    "tagline": "The style language that lays out and designs the web",
    "summary": "CSS (Cascading Style Sheets) is the W3C standard language for describing how HTML and other markup documents are presented — controlling color, typography, spacing, and layout separately from content structure. It is one of the three core web technologies alongside HTML and JavaScript, and modern CSS handles responsive layout (Flexbox, Grid), animations, custom properties, and container queries. Its \"cascade\" and specificity model resolve conflicting rules from author, user, and browser stylesheets in a defined order. It matters because it decouples visual presentation from document semantics, letting a single stylesheet restyle an entire site and enabling accessible, adaptable interfaces across screen sizes and devices.",
    "papers": [
      {
        "title": "Cascading HTML Style Sheets — A Proposal",
        "authors": "Håkon Wium Lie",
        "year": 1994,
        "venue": "W3C / CERN",
        "url": "https://www.w3.org/People/howcome/p/cascade.html",
        "note": "The seminal 1994 document that introduced the cascade concept behind CSS."
      },
      {
        "title": "Cascading Style Sheets Level 2 Revision 1 (CSS 2.1) Specification",
        "authors": "Bert Bos, Tantek Çelik, Ian Hickson, Håkon Wium Lie (eds.), W3C CSS Working Group",
        "year": 2011,
        "venue": "W3C Recommendation",
        "url": "https://www.w3.org/TR/CSS2/",
        "note": "The foundational normative spec defining the CSS box model, cascade, and visual formatting."
      },
      {
        "title": "CSS Snapshot 2023",
        "authors": "Tab Atkins Jr., Elika J. Etemad, Florian Rivoal, Chris Lilley (eds.), W3C CSS Working Group",
        "year": 2023,
        "venue": "W3C Group Note",
        "url": "https://www.w3.org/TR/css-2023/",
        "note": "Defines the current stable scope of CSS across its many modular specifications."
      }
    ],
    "books": [
      {
        "title": "CSS: The Definitive Guide, 5th Edition",
        "authors": "Eric A. Meyer, Estelle Weyl",
        "year": 2023,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/css-the-definitive/9781098117603/",
        "note": "Comprehensive reference covering selectors, the cascade, and modern layout."
      },
      {
        "title": "CSS Secrets: Better Solutions to Everyday Web Design Problems",
        "authors": "Lea Verou",
        "year": 2015,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/css-secrets/9781449372736/",
        "note": "47 practical techniques for elegant, maintainable CSS from a W3C CSS WG member."
      }
    ],
    "resources": [
      {
        "label": "MDN Web Docs — CSS reference and guides",
        "url": "https://developer.mozilla.org/en-US/docs/Web/CSS"
      },
      {
        "label": "W3C CSS home page (official standards portal)",
        "url": "https://www.w3.org/Style/CSS/"
      },
      {
        "label": "CSS Working Group current work and specifications",
        "url": "https://www.w3.org/TR/?tag=css"
      }
    ]
  },
  "REST APIs": {
    "category": "Modern Stack",
    "tagline": "Stateless web APIs built on HTTP verbs and resource URLs",
    "summary": "REST (Representational State Transfer) is an architectural style for networked applications in which clients interact with named resources, identified by URLs, using standard HTTP methods like GET, POST, PUT, PATCH, and DELETE. A REST API exposes an application's data and operations over HTTP in a stateless, cacheable, uniform way, most often exchanging JSON representations of resources. It matters because it is the de facto contract for web and mobile back ends and service-to-service integration: its reliance on plain HTTP semantics makes APIs language-agnostic, easy to cache and scale behind proxies and CDNs, and simple to consume from virtually any client without special tooling.",
    "papers": [
      {
        "title": "Architectural Styles and the Design of Network-based Software Architectures (Chapter 5: Representational State Transfer)",
        "authors": "Roy Thomas Fielding",
        "year": 2000,
        "venue": "PhD Dissertation, University of California, Irvine",
        "url": "https://ics.uci.edu/~fielding/pubs/dissertation/top.htm",
        "note": "The seminal work that defined REST and its architectural constraints"
      },
      {
        "title": "RFC 9110: HTTP Semantics",
        "authors": "R. Fielding, M. Nottingham, J. Reschke (IETF)",
        "year": 2022,
        "venue": "IETF Internet Standard (STD 97)",
        "url": "https://www.rfc-editor.org/rfc/rfc9110.html",
        "note": "Authoritative spec for the methods, status codes, and headers REST relies on"
      }
    ],
    "books": [
      {
        "title": "RESTful Web APIs: Services for a Changing World",
        "authors": "Leonard Richardson, Mike Amundsen, Sam Ruby",
        "year": 2013,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/restful-web-apis/9781449359713/",
        "note": "Modern, hypermedia-focused successor to RESTful Web Services"
      },
      {
        "title": "RESTful Web Services",
        "authors": "Leonard Richardson, Sam Ruby",
        "year": 2007,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/restful-web-services/9780596529260/",
        "note": "The first book-length treatment of pragmatic RESTful design"
      },
      {
        "title": "REST API Design Rulebook",
        "authors": "Mark Massé",
        "year": 2011,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/rest-api-design/9781449317904/",
        "note": "Concise, opinionated rules for URI, method, and media-type design"
      }
    ],
    "resources": [
      {
        "label": "MDN Web Docs — HTTP (methods, status codes, headers)",
        "url": "https://developer.mozilla.org/en-US/docs/Web/HTTP"
      },
      {
        "label": "OpenAPI Specification (standard for describing REST APIs)",
        "url": "https://spec.openapis.org/oas/latest.html"
      },
      {
        "label": "RFC 9110 — HTTP Semantics (IETF)",
        "url": "https://www.rfc-editor.org/rfc/rfc9110.html"
      }
    ]
  },
  "MySQL": {
    "category": "Modern Stack",
    "tagline": "The world's most popular open-source relational database",
    "summary": "MySQL is an open-source relational database management system that stores data in tables and is queried with SQL. Created in 1995 and now developed by Oracle, it uses a pluggable storage-engine architecture whose default engine, InnoDB, provides ACID transactions, row-level locking, foreign keys, and crash recovery via write-ahead logging. It is a cornerstone of the classic LAMP stack and backs a huge share of web applications, powering everything from small sites to large-scale platforms. Its popularity comes from being fast, reliable, well-documented, and free, with mature tooling, replication, and a large ecosystem that make it a safe default for transactional workloads.",
    "papers": [
      {
        "title": "A Relational Model of Data for Large Shared Data Banks",
        "authors": "E. F. Codd",
        "year": 1970,
        "venue": "Communications of the ACM, Vol. 13, No. 6",
        "url": "https://dl.acm.org/doi/10.1145/362384.362685",
        "note": "The seminal paper defining the relational model of tables that MySQL and SQL are built on."
      },
      {
        "title": "ARIES: A Transaction Recovery Method Supporting Fine-Granularity Locking and Partial Rollbacks Using Write-Ahead Logging",
        "authors": "C. Mohan, Don Haderle, Bruce Lindsay, Hamid Pirahesh, Peter Schwarz",
        "year": 1992,
        "venue": "ACM Transactions on Database Systems, Vol. 17, No. 1",
        "url": "https://dl.acm.org/doi/10.1145/128765.128770",
        "note": "The write-ahead logging and recovery algorithm underlying InnoDB's crash recovery and locking."
      }
    ],
    "books": [
      {
        "title": "High Performance MySQL, 4th Edition: Proven Strategies for Operating at Scale",
        "authors": "Silvia Botros, Jeremy Tinley",
        "year": 2021,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/high-performance-mysql/9781492080503/",
        "note": "The standard reference for schema design, replication, and running MySQL reliably at scale."
      },
      {
        "title": "Learning MySQL, 2nd Edition",
        "authors": "Vinicius Grippa, Sergey Kuzmichev",
        "year": 2021,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/learning-mysql-2nd/9781492085911/",
        "note": "A practical, hands-on introduction covering installation, querying, administration, backup, and tuning."
      }
    ],
    "resources": [
      {
        "label": "MySQL 8.0 Reference Manual (official documentation)",
        "url": "https://dev.mysql.com/doc/refman/8.0/en/"
      },
      {
        "label": "MySQL official homepage",
        "url": "https://www.mysql.com/"
      },
      {
        "label": "MySQL documentation portal",
        "url": "https://dev.mysql.com/doc/"
      }
    ]
  },
  "Docker": {
    "category": "Modern Stack",
    "tagline": "Package apps into portable containers that run anywhere.",
    "summary": "Docker is an open platform for building, shipping, and running applications inside containers — lightweight, isolated processes that bundle an app with all its dependencies using Linux kernel features like namespaces and cgroups. Unlike full virtual machines, containers share the host kernel, so they start in seconds and are far more resource-efficient. Developers use Docker to get consistent environments from a laptop to CI to production, eliminating the \"works on my machine\" problem, and it underpins most modern microservice and cloud-native deployments. Its image format and runtime were later standardized under the Open Container Initiative, making containers portable across the broader ecosystem including Kubernetes.",
    "papers": [
      {
        "title": "Docker: Lightweight Linux Containers for Consistent Development and Deployment",
        "authors": "Dirk Merkel",
        "year": 2014,
        "venue": "Linux Journal, Vol. 2014, Issue 239",
        "url": "https://dl.acm.org/doi/10.5555/2600239.2600241",
        "note": "The seminal, widely-cited introduction to Docker and its container model."
      },
      {
        "title": "OCI Image Format Specification",
        "authors": "Open Container Initiative",
        "year": 2021,
        "venue": "Open Container Initiative (Linux Foundation)",
        "url": "https://github.com/opencontainers/image-spec",
        "note": "The open standard defining the container image format Docker images conform to."
      },
      {
        "title": "OCI Runtime Specification",
        "authors": "Open Container Initiative",
        "year": 2021,
        "venue": "Open Container Initiative (Linux Foundation)",
        "url": "https://github.com/opencontainers/runtime-spec",
        "note": "The standard specifying how a container runtime executes a bundle, underlying Docker/containerd."
      }
    ],
    "books": [
      {
        "title": "Docker: Up & Running: Shipping Reliable Containers in Production (3rd Edition)",
        "authors": "Sean P. Kane, Karl Matthias",
        "year": 2023,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/docker-up/9781098131814/",
        "note": "Practical, production-focused guide covering BuildKit, buildx, and rootless containers."
      },
      {
        "title": "Docker Deep Dive",
        "authors": "Nigel Poulton",
        "year": 2025,
        "publisher": "Leanpub (self-published)",
        "url": "https://leanpub.com/dockerdeepdive",
        "note": "The most popular hands-on Docker book, kept current with each Docker release."
      }
    ],
    "resources": [
      {
        "label": "Docker official documentation",
        "url": "https://docs.docker.com/"
      },
      {
        "label": "Docker homepage",
        "url": "https://www.docker.com/"
      },
      {
        "label": "Open Container Initiative (OCI) standards",
        "url": "https://opencontainers.org/"
      }
    ]
  },
  "Git": {
    "category": "Modern Stack",
    "tagline": "Distributed version control for tracking and merging code history",
    "summary": "Git is a free, open-source distributed version control system created by Linus Torvalds in 2005 to manage Linux kernel development. It tracks changes to files by storing content-addressed snapshots in a directed acyclic graph, giving every developer a full copy of the project history and enabling fast, offline branching, merging, and commits. It matters because it is the de facto standard for source control: it underpins collaboration platforms like GitHub and GitLab and is the backbone of virtually all modern software development and CI/CD workflows.",
    "papers": [
      {
        "title": "A Digital Signature Based on a Conventional Encryption Function",
        "authors": "Ralph C. Merkle",
        "year": 1987,
        "venue": "Advances in Cryptology — CRYPTO '87, LNCS vol. 293, Springer",
        "url": "https://doi.org/10.1007/3-540-48184-2_32",
        "note": "Introduces the Merkle (hash) tree, the content-addressed, tamper-evident structure whose DAG form underlies Git's object model."
      }
    ],
    "books": [
      {
        "title": "Pro Git (2nd Edition)",
        "authors": "Scott Chacon and Ben Straub",
        "year": 2014,
        "publisher": "Apress",
        "url": "https://git-scm.com/book",
        "note": "The official, freely available Git book covering everything from basics to internals."
      },
      {
        "title": "Version Control with Git: Powerful Tools and Techniques for Collaborative Software Development",
        "authors": "Jon Loeliger and Matthew McCullough",
        "year": 2012,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/version-control-with/9781449345037/",
        "note": "In-depth guide to Git's commands and internal object model."
      }
    ],
    "resources": [
      {
        "label": "Git official homepage",
        "url": "https://git-scm.com/"
      },
      {
        "label": "Git official documentation and reference manual",
        "url": "https://git-scm.com/doc"
      }
    ]
  },
  "GitHub": {
    "category": "Modern Stack",
    "tagline": "Git-based hosting for code, collaboration, and CI/CD",
    "summary": "GitHub is a web platform for hosting Git repositories and coordinating software development around them. It layers social and workflow features on top of Git's distributed version control: pull requests for code review, issues for tracking work, forks for contribution, and GitHub Actions for automated CI/CD pipelines. It is the de facto home for open-source software and a common backbone for private engineering teams, which makes fluency with its review and automation model a baseline skill for working engineers.",
    "papers": [
      {
        "title": "Social Coding in GitHub: Transparency and Collaboration in an Open Software Repository",
        "authors": "Laura Dabbish, Colleen Stuart, Jason Tsay, Jim Herbsleb",
        "year": 2012,
        "venue": "CSCW '12: ACM Conference on Computer Supported Cooperative Work",
        "url": "https://doi.org/10.1145/2145204.2145396",
        "note": "Foundational study of how GitHub's visible activity shapes collaboration"
      },
      {
        "title": "The Promises and Perils of Mining GitHub",
        "authors": "Eirini Kalliamvakou, Georgios Gousios, Kelly Blincoe, Leif Singer, Daniel M. German, Daniela Damian",
        "year": 2014,
        "venue": "MSR '14: Working Conference on Mining Software Repositories",
        "url": "https://doi.org/10.1145/2597073.2597074",
        "note": "Explains how GitHub's data and workflows (pull requests, forks) actually behave"
      }
    ],
    "books": [
      {
        "title": "Pro Git (2nd Edition)",
        "authors": "Scott Chacon, Ben Straub",
        "year": 2014,
        "publisher": "Apress",
        "url": "https://git-scm.com/book/en/v2",
        "note": "The canonical Git reference; includes a dedicated chapter on GitHub"
      }
    ],
    "resources": [
      {
        "label": "GitHub Docs (official documentation)",
        "url": "https://docs.github.com"
      },
      {
        "label": "GitHub Actions documentation",
        "url": "https://docs.github.com/actions"
      },
      {
        "label": "GitHub REST API reference",
        "url": "https://docs.github.com/rest"
      }
    ]
  },
  "Azure": {
    "category": "Modern Stack",
    "tagline": "Microsoft's cloud platform for compute, storage, data, and AI",
    "summary": "Azure is Microsoft's public cloud platform, offering hundreds of managed services for compute, storage, networking, databases, identity, and machine learning across a global network of data centers. Teams use it to host web apps and APIs, run containers and Kubernetes, build serverless functions, store and analyze data, and integrate AI, provisioning resources on demand instead of operating their own hardware. It is one of the two dominant hyperscale clouds alongside AWS, and its tight integration with Microsoft identity (Entra ID), Windows, and enterprise tooling makes it a default choice in many organizations. Infrastructure is typically defined and automated through ARM/Bicep templates, the Azure CLI, or Terraform, making it a core skill for cloud and DevOps engineering.",
    "papers": [
      {
        "title": "Windows Azure Storage: A Highly Available Cloud Storage Service with Strong Consistency",
        "authors": "Brad Calder, Ju Wang, Aaron Ogus, Niranjan Nilakantan, et al.",
        "year": 2011,
        "venue": "SOSP '11 (ACM Symposium on Operating Systems Principles)",
        "url": "https://doi.org/10.1145/2043556.2043571",
        "note": "The foundational systems paper on Azure's storage stack (stream, partition, and front-end layers plus replication); explains how a hyperscale cloud achieves durability, consistency, and scale."
      },
      {
        "title": "Service Fabric: A Distributed Platform for Building Microservices in the Cloud",
        "authors": "Gopal Kakivaya, Lu Xun, Richard Hasha, et al.",
        "year": 2018,
        "venue": "EuroSys '18 (Thirteenth EuroSys Conference)",
        "url": "https://doi.org/10.1145/3190508.3190546",
        "note": "Describes the distributed platform underpinning many core Azure services (failure detection, leader election, replication), illuminating how the cloud runs reliable microservices at scale."
      }
    ],
    "books": [
      {
        "title": "Learn Azure in a Month of Lunches, Second Edition",
        "authors": "Iain Foulds",
        "year": 2020,
        "publisher": "Manning Publications",
        "url": "https://www.manning.com/books/learn-azure-in-a-month-of-lunches-second-edition",
        "note": "Hands-on, lesson-based introduction to core Azure services with practical labs; ideal for getting productive quickly."
      },
      {
        "title": "Azure for Architects, Third Edition",
        "authors": "Ritesh Modi, Jack Lee, Rithin Skaria",
        "year": 2020,
        "publisher": "Packt Publishing",
        "url": "https://www.amazon.com/Azure-Architects-scalable-high-availability-applications/dp/1839215860",
        "note": "Covers cloud design patterns, ARM templates, AKS, serverless, and DevOps for building secure, scalable Azure solutions."
      }
    ],
    "resources": [
      {
        "label": "Azure documentation (Microsoft Learn)",
        "url": "https://learn.microsoft.com/en-us/azure/"
      },
      {
        "label": "Microsoft Azure homepage",
        "url": "https://azure.microsoft.com/"
      },
      {
        "label": "Azure Architecture Center",
        "url": "https://learn.microsoft.com/en-us/azure/architecture/"
      }
    ]
  },
  "IBM watsonx.ai": {
    "category": "AI & Data",
    "tagline": "IBM's enterprise studio for building and deploying AI",
    "summary": "IBM watsonx.ai is an enterprise-grade AI studio for training, validating, tuning, and deploying both traditional machine learning and generative AI powered by foundation models. It provides access to IBM's own Granite foundation models alongside third-party open models (such as Llama and Mistral), plus tooling for prompt engineering, fine-tuning, retrieval-augmented generation, and agent workflows, exposed through a unified UI, REST APIs, and a Python SDK. It is one of the three pillars of the broader watsonx platform, sitting next to watsonx.data (data store) and watsonx.governance (model governance). It matters because it targets the enterprise gap around generative AI: governed, deployable, on-prem-or-cloud model development with attention to data provenance, IP indemnification, and the full data-and-AI lifecycle.",
    "papers": [
      {
        "title": "Granite Code Models: A Family of Open Foundation Models for Code Intelligence",
        "authors": "Mayank Mishra, Matt Stallone, Gaoyuan Zhang, et al. (IBM Research)",
        "year": 2024,
        "venue": "arXiv preprint arXiv:2405.04324",
        "url": "https://arxiv.org/abs/2405.04324",
        "note": "The technical report for IBM's Granite code models, the flagship IBM-built foundation models served in watsonx.ai."
      },
      {
        "title": "Attention Is All You Need",
        "authors": "Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.",
        "year": 2017,
        "venue": "Advances in Neural Information Processing Systems (NeurIPS)",
        "url": "https://arxiv.org/abs/1706.03762",
        "note": "Introduces the Transformer, the underlying architecture behind the foundation models watsonx.ai serves and tunes."
      }
    ],
    "books": [],
    "resources": [
      {
        "label": "IBM watsonx.ai product homepage",
        "url": "https://www.ibm.com/products/watsonx-ai"
      },
      {
        "label": "IBM Redbook: Simplify Your AI Journey — Unleashing the Power of AI with IBM watsonx.ai (SG24-8574)",
        "url": "https://www.redbooks.ibm.com/abstracts/sg248574.html"
      },
      {
        "label": "watsonx.ai Python SDK documentation",
        "url": "https://ibm.github.io/watsonx-ai-python-sdk/"
      }
    ]
  },
  "IBM Cloudant": {
    "category": "AI & Data",
    "tagline": "Fully-managed distributed JSON document DB, built on Apache CouchDB",
    "summary": "IBM Cloudant is a fully managed, distributed JSON document database delivered as a service on IBM Cloud, built on and API-compatible with Apache CouchDB. It stores schema-free JSON documents behind an HTTP/REST API and adds MapReduce views, the Mango/Cloudant Query language, full-text search, geospatial indexing, and multi-master replication for offline-first and edge-sync scenarios. Engineers use it for web and mobile back-ends that need elastic serverless scaling, high availability across availability zones and regions, and continuous replication between cloud and devices. It matters because it brings CouchDB's replication-centric, eventually-consistent model to a managed platform, removing operational overhead while staying a drop-in-compatible target for existing CouchDB applications.",
    "papers": [
      {
        "title": "Dynamo: Amazon's Highly Available Key-value Store",
        "authors": "Giuseppe DeCandia, Deniz Hastorun, Madan Jampani, Gunavardhan Kakulapati, Avinash Lakshman, Alex Pilchin, Swaminathan Sivasubramanian, Peter Vosshall, Werner Vogels",
        "year": 2007,
        "venue": "ACM SOSP 2007 / SIGOPS Operating Systems Review 41(6)",
        "url": "https://doi.org/10.1145/1323293.1294281",
        "note": "The distributed, eventually-consistent, quorum-replicated design that underpins Cloudant's clustering layer (BigCouch)."
      },
      {
        "title": "MapReduce: Simplified Data Processing on Large Clusters",
        "authors": "Jeffrey Dean, Sanjay Ghemawat",
        "year": 2008,
        "venue": "Communications of the ACM 51(1) / OSDI 2004",
        "url": "https://doi.org/10.1145/1327452.1327492",
        "note": "The programming model behind CouchDB/Cloudant secondary indexes ('views'), which are defined as map and reduce functions."
      }
    ],
    "books": [
      {
        "title": "CouchDB: The Definitive Guide",
        "authors": "J. Chris Anderson, Jan Lehnardt, Noah Slater",
        "year": 2010,
        "publisher": "O'Reilly Media",
        "url": "https://guide.couchdb.org/",
        "note": "Canonical, freely-licensed guide to CouchDB documents, MapReduce views, and replication — the engine Cloudant is API-compatible with."
      }
    ],
    "resources": [
      {
        "label": "IBM Cloudant product homepage",
        "url": "https://www.ibm.com/products/cloudant"
      },
      {
        "label": "IBM Cloudant official documentation (IBM Cloud Docs)",
        "url": "https://cloud.ibm.com/docs/Cloudant"
      },
      {
        "label": "Apache CouchDB documentation (the compatible open-source engine)",
        "url": "https://docs.couchdb.org/"
      }
    ]
  },
  "MCP": {
    "category": "AI & Data",
    "tagline": "Open standard for wiring AI models to tools and data",
    "summary": "The Model Context Protocol (MCP) is an open standard, introduced by Anthropic in November 2024, that defines a uniform client-server interface for connecting LLM applications to external tools, data sources, and prompts over JSON-RPC 2.0. Rather than hand-building a bespoke integration for every model-and-tool pairing, developers expose capabilities once through an MCP server as tools (callable functions), resources (readable data), and prompts (reusable templates), and any MCP-compatible client such as Claude Desktop, an IDE, or an autonomous agent can consume them. It matters because it collapses the fragmented N-by-M integration problem into a single shared protocol, and its rapid cross-industry adoption, culminating in its December 2025 donation to the Linux Foundation's Agentic AI Foundation, has made it the de facto plumbing for agentic AI.",
    "papers": [
      {
        "title": "Model Context Protocol (MCP): Landscape, Security Threats, and Future Research Directions",
        "authors": "Xinyi Hou, Yanjie Zhao, Shenao Wang, Haoyu Wang",
        "year": 2025,
        "venue": "arXiv preprint arXiv:2503.23278 (cs.CR, cs.AI)",
        "url": "https://arxiv.org/abs/2503.23278",
        "note": "The most-cited academic survey of MCP: maps its architecture, adoption, lifecycle, and threat model."
      }
    ],
    "books": [
      {
        "title": "AI Agents with MCP: Model Context Protocol for Building Clients, Services, and End-to-End Agents",
        "authors": "Kyle Stratis",
        "year": 2025,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/ai-agents-with/9798341639546/",
        "note": "Hands-on guide to MCP protocol structure plus server and client implementation."
      },
      {
        "title": "Model Context Protocol: Master the Integration of AI Agents and Model Context Protocol with Real-World Applications",
        "authors": "Mehul Gupta, Niladri Sen",
        "year": 2025,
        "publisher": "Packt Publishing",
        "url": "https://www.oreilly.com/library/view/model-context-protocol/9781806112371/",
        "note": "Introduces MCP's core components and steps through installing and using MCP servers with real-world agent examples."
      }
    ],
    "resources": [
      {
        "label": "Model Context Protocol - official documentation & specification",
        "url": "https://modelcontextprotocol.io/specification/2025-11-25"
      },
      {
        "label": "Introducing the Model Context Protocol (Anthropic announcement)",
        "url": "https://www.anthropic.com/news/model-context-protocol"
      },
      {
        "label": "modelcontextprotocol/modelcontextprotocol - spec & schema (GitHub)",
        "url": "https://github.com/modelcontextprotocol/modelcontextprotocol"
      }
    ]
  },
  "Granite Code": {
    "category": "AI & Data",
    "tagline": "IBM's open-source family of code LLMs across 116 languages",
    "summary": "Granite Code is IBM's family of open (Apache 2.0) decoder-only large language models built specifically for code intelligence, trained on roughly 3-4 trillion tokens spanning 116 programming languages and released in sizes from 3B to 34B parameters in both base and instruction-tuned variants. It targets tasks like code generation, explanation, bug fixing, translation, and editing, aimed squarely at enterprise software development and application-modernization workflows. It matters because it delivers competitive-to-state-of-the-art open code-model performance under a permissive commercial license, giving teams a transparent, self-hostable alternative to closed coding assistants.",
    "papers": [
      {
        "title": "Granite Code Models: A Family of Open Foundation Models for Code Intelligence",
        "authors": "Mayank Mishra, Matt Stallone, Gaoyuan Zhang, et al. (IBM Research)",
        "year": 2024,
        "venue": "arXiv preprint arXiv:2405.04324",
        "url": "https://arxiv.org/abs/2405.04324",
        "note": "The official technical report describing Granite Code's data, training, architecture, and benchmarks."
      },
      {
        "title": "Attention Is All You Need",
        "authors": "Ashish Vaswani, Noam Shazeer, Niki Parmar, et al.",
        "year": 2017,
        "venue": "NeurIPS 2017 (arXiv:1706.03762)",
        "url": "https://arxiv.org/abs/1706.03762",
        "note": "Introduces the Transformer, the attention-based architecture underlying modern decoder-only code LLMs like Granite Code."
      }
    ],
    "books": [],
    "resources": [
      {
        "label": "IBM Granite Code - official model documentation",
        "url": "https://www.ibm.com/granite/docs/models/code"
      },
      {
        "label": "ibm-granite/granite-code-models - GitHub (technical report & usage)",
        "url": "https://github.com/ibm-granite/granite-code-models"
      },
      {
        "label": "Granite Code Models collection on Hugging Face",
        "url": "https://huggingface.co/collections/ibm-granite/granite-code-models-6624c5cec322e4c148c8b330"
      }
    ]
  },
  "Pandas": {
    "category": "AI & Data",
    "tagline": "Fast, expressive labeled data structures for Python analytics",
    "summary": "Pandas is an open-source Python library that provides the DataFrame and Series, in-memory data structures for working with labeled, tabular, and time-series data. It offers vectorized operations for loading, cleaning, reshaping, joining, grouping, and aggregating data, sitting on top of NumPy and interoperating with the wider scientific Python and machine-learning ecosystem. It matters because it is the de facto standard for data wrangling and exploratory analysis in Python, forming the practical entry point for most data science and ML pipelines where messy real-world data must be turned into analysis-ready form.",
    "papers": [
      {
        "title": "Data Structures for Statistical Computing in Python",
        "authors": "Wes McKinney",
        "year": 2010,
        "venue": "Proceedings of the 9th Python in Science Conference (SciPy 2010)",
        "url": "https://doi.org/10.25080/Majora-92bf1922-00a",
        "note": "The seminal paper introducing pandas and its DataFrame design rationale."
      },
      {
        "title": "Array programming with NumPy",
        "authors": "Charles R. Harris, K. Jarrod Millman, Stéfan J. van der Walt, et al.",
        "year": 2020,
        "venue": "Nature 585, 357-362",
        "url": "https://doi.org/10.1038/s41586-020-2649-2",
        "note": "Explains the NumPy array model that pandas is built on top of."
      }
    ],
    "books": [
      {
        "title": "Python for Data Analysis: Data Wrangling with pandas, NumPy, and Jupyter (3rd Edition)",
        "authors": "Wes McKinney",
        "year": 2022,
        "publisher": "O'Reilly Media",
        "url": "https://wesmckinney.com/book/",
        "note": "The canonical, free open-access book by the creator of pandas."
      }
    ],
    "resources": [
      {
        "label": "Pandas official documentation",
        "url": "https://pandas.pydata.org/docs/"
      },
      {
        "label": "Pandas project homepage",
        "url": "https://pandas.pydata.org/"
      },
      {
        "label": "Pandas User Guide",
        "url": "https://pandas.pydata.org/docs/user_guide/index.html"
      }
    ]
  },
  "NumPy": {
    "category": "AI & Data",
    "tagline": "The foundational array library for numerical computing in Python",
    "summary": "NumPy is the core open-source library for numerical computing in Python, providing the N-dimensional ndarray, a contiguous, homogeneously-typed array object, along with vectorized operations, broadcasting, linear algebra, FFTs, and random number generation. It moves heavy numeric work out of interpreted Python loops into optimized C and Fortran routines, giving both concise syntax and near-native performance. Nearly the entire scientific Python and machine-learning stack (pandas, SciPy, scikit-learn, TensorFlow, PyTorch, and others) is built on or interoperates with NumPy arrays, which makes it the de facto substrate for data analysis and AI workloads in Python.",
    "papers": [
      {
        "title": "Array programming with NumPy",
        "authors": "Charles R. Harris, K. Jarrod Millman, Stéfan J. van der Walt, et al.",
        "year": 2020,
        "venue": "Nature, vol. 585",
        "url": "https://doi.org/10.1038/s41586-020-2649-2",
        "note": "The canonical, definitive NumPy paper describing the array model and ecosystem"
      },
      {
        "title": "The NumPy Array: A Structure for Efficient Numerical Computation",
        "authors": "Stéfan van der Walt, S. Chris Colbert, Gaël Varoquaux",
        "year": 2011,
        "venue": "Computing in Science & Engineering, vol. 13",
        "url": "https://doi.org/10.1109/MCSE.2011.37",
        "note": "Explains the memory layout, strides, and broadcasting that make NumPy fast"
      },
      {
        "title": "Python for Scientific Computing",
        "authors": "Travis E. Oliphant",
        "year": 2007,
        "venue": "Computing in Science & Engineering, vol. 9",
        "url": "https://doi.org/10.1109/MCSE.2007.58",
        "note": "By NumPy's original author; motivates arrays as the basis for scientific Python"
      }
    ],
    "books": [
      {
        "title": "Python for Data Analysis (3rd Edition)",
        "authors": "Wes McKinney",
        "year": 2022,
        "publisher": "O'Reilly Media",
        "url": "https://wesmckinney.com/book/",
        "note": "Standard practical intro to NumPy and pandas; full text free online"
      },
      {
        "title": "From Python to NumPy",
        "authors": "Nicolas P. Rougier",
        "year": 2017,
        "publisher": "Self-published (open access)",
        "url": "https://www.labri.fr/perso/nrougier/from-python-to-numpy/",
        "note": "Free, NumPy-focused book on vectorization and broadcasting patterns"
      },
      {
        "title": "Elegant SciPy: The Art of Scientific Python",
        "authors": "Juan Nunez-Iglesias, Stéfan van der Walt, Harriet Dashnow",
        "year": 2017,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/elegant-scipy/9781491922927/",
        "note": "Idiomatic NumPy/SciPy usage through real scientific examples"
      }
    ],
    "resources": [
      {
        "label": "NumPy official homepage",
        "url": "https://numpy.org/"
      },
      {
        "label": "NumPy documentation (stable)",
        "url": "https://numpy.org/doc/stable/"
      },
      {
        "label": "NumPy Enhancement Proposals (NEPs)",
        "url": "https://numpy.org/neps/"
      }
    ]
  },
  "Matplotlib": {
    "category": "AI & Data",
    "tagline": "The foundational 2D plotting library for Python",
    "summary": "Matplotlib is an open-source Python library for creating static, animated, and interactive visualizations, built around a NumPy-friendly array model and a MATLAB-inspired pyplot interface. It provides fine-grained control over figures, axes, and artists to produce publication-quality charts, and it exports to raster and vector formats (PNG, PDF, SVG) via pluggable backends. As the de facto plotting foundation of the scientific Python stack, it underpins higher-level tools like pandas plotting and seaborn, making it a core skill for exploratory data analysis, reporting, and reproducible research.",
    "papers": [
      {
        "title": "Matplotlib: A 2D Graphics Environment",
        "authors": "John D. Hunter",
        "year": 2007,
        "venue": "Computing in Science & Engineering, vol. 9, no. 3, pp. 90-95 (IEEE)",
        "url": "https://doi.org/10.1109/MCSE.2007.55",
        "note": "The seminal, most-cited reference describing Matplotlib's design and goals, written by its creator."
      }
    ],
    "books": [
      {
        "title": "Python Data Science Handbook: Essential Tools for Working with Data (2nd Edition)",
        "authors": "Jake VanderPlas",
        "year": 2022,
        "publisher": "O'Reilly Media",
        "url": "https://jakevdp.github.io/PythonDataScienceHandbook/",
        "note": "Includes an in-depth, freely available chapter on visualization with Matplotlib in context with NumPy and pandas."
      }
    ],
    "resources": [
      {
        "label": "Matplotlib official documentation (stable)",
        "url": "https://matplotlib.org/stable/"
      },
      {
        "label": "Matplotlib homepage",
        "url": "https://matplotlib.org/"
      },
      {
        "label": "Matplotlib tutorials and user guide",
        "url": "https://matplotlib.org/stable/users/index.html"
      }
    ]
  },
  "WMA": {
    "category": "AI & Data",
    "tagline": "Weighted Moving Average: recency-weighted smoothing for time series",
    "summary": "WMA (Weighted Moving Average) is a time-series smoothing technique that averages a sliding window of observations while giving larger weights to the most recent points, so it tracks trend changes faster than a simple (equally weighted) moving average. It is used to filter out noise, reveal the underlying trend-cycle, and produce short-horizon forecasts in areas ranging from demand planning to financial technical analysis. In a data workflow it is a lightweight, interpretable baseline — a couple of lines in pandas or NumPy — that often runs alongside heavier statistical or ML forecasters. Its exponentially weighted cousin, EWMA, generalizes the same idea and underpins classic statistical process-control charts.",
    "papers": [
      {
        "title": "Control Chart Tests Based on Geometric Moving Averages",
        "authors": "S. W. Roberts",
        "year": 1959,
        "venue": "Technometrics, 1(3), 239-250",
        "url": "https://doi.org/10.1080/00401706.1959.10489860",
        "note": "Seminal paper introducing the geometric (exponentially weighted) moving average — the foundation of EWMA smoothing and control charts."
      },
      {
        "title": "Forecasting seasonals and trends by exponentially weighted moving averages",
        "authors": "Charles C. Holt",
        "year": 2004,
        "venue": "International Journal of Forecasting, 20(1), 5-10",
        "url": "https://doi.org/10.1016/j.ijforecast.2003.09.015",
        "note": "Classic 1957 ONR memo (reprinted 2004) that formalized weighted/exponentially weighted moving averages for trend and seasonal forecasting."
      }
    ],
    "books": [
      {
        "title": "Forecasting: Principles and Practice (3rd ed.)",
        "authors": "Rob J. Hyndman, George Athanasopoulos",
        "year": 2021,
        "publisher": "OTexts",
        "url": "https://otexts.com/fpp3/",
        "note": "Free canonical text; Section 3.3 covers moving-average smoothing and weighted moving averages in context."
      }
    ],
    "resources": [
      {
        "label": "pandas — rolling() with weighted windows (win_type), official docs",
        "url": "https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.rolling.html"
      },
      {
        "label": "Forecasting: Principles & Practice §3.3 — Moving averages",
        "url": "https://otexts.com/fpp3/moving-averages.html"
      },
      {
        "label": "QuestDB glossary — Weighted Moving Average",
        "url": "https://questdb.com/glossary/weighted-moving-average/"
      }
    ]
  },
  "VS Code": {
    "category": "Tools & Practice",
    "tagline": "Microsoft's free, extensible, cross-platform code editor",
    "summary": "Visual Studio Code (VS Code) is a free, open-source source-code editor from Microsoft that runs on Windows, macOS, and Linux, built on the Electron framework. It combines lightweight editing with IDE-like features such as syntax highlighting, IntelliSense code completion, integrated Git, an interactive debugger, and a built-in terminal. Its capabilities are driven by a large extension marketplace and by open protocols like the Language Server Protocol (LSP) and Debug Adapter Protocol (DAP), which let a single editor support virtually any language or toolchain. It matters because it has become the most widely used editor among professional developers, making it a de facto standard workspace across nearly every stack.",
    "papers": [
      {
        "title": "Language Server Protocol Specification - 3.17",
        "authors": "Microsoft",
        "year": 2022,
        "venue": "Official specification (Microsoft)",
        "url": "https://microsoft.github.io/language-server-protocol/specifications/lsp/3.17/specification/",
        "note": "The open protocol behind VS Code's language intelligence (completion, diagnostics, go-to-definition) across editors."
      }
    ],
    "books": [
      {
        "title": "Visual Studio Code Distilled: Evolved Code Editing for Windows, macOS, and Linux (3rd ed.)",
        "authors": "Alessandro Del Sole",
        "year": 2023,
        "publisher": "Apress",
        "url": "https://link.springer.com/book/10.1007/978-1-4842-9484-0",
        "note": "Practical, task-focused tour of editing, projects, debugging, and Git in VS Code."
      },
      {
        "title": "Visual Studio Code for Python Programmers",
        "authors": "April Speight",
        "year": 2021,
        "publisher": "Wiley",
        "url": "https://www.wiley.com/en-us/Visual+Studio+Code+for+Python+Programmers-p-9781119773368",
        "note": "Covers workspace setup, source control, debugging, unit testing, and Jupyter support in VS Code."
      }
    ],
    "resources": [
      {
        "label": "Visual Studio Code Documentation",
        "url": "https://code.visualstudio.com/docs"
      },
      {
        "label": "VS Code homepage",
        "url": "https://code.visualstudio.com/"
      },
      {
        "label": "microsoft/vscode source repository (GitHub)",
        "url": "https://github.com/microsoft/vscode"
      }
    ]
  },
  "Cursor (AI)": {
    "category": "Tools & Practice",
    "tagline": "AI-first code editor with LLM chat, inline edits, and agents",
    "summary": "Cursor is a proprietary AI-powered code editor built by Anysphere as a fork of Visual Studio Code, embedding large language models directly into the editing workflow. Developers use it to autocomplete multi-line edits, ask questions grounded in their codebase, and run agentic tasks that plan and apply changes across multiple files. It matters because it helped popularize the \"AI-native IDE\" pattern — tight, context-aware integration between an editor and an LLM — that has since become a standard expectation in developer tooling.",
    "papers": [
      {
        "title": "Attention Is All You Need",
        "authors": "Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Lukasz Kaiser, Illia Polosukhin",
        "year": 2017,
        "venue": "NeurIPS (Advances in Neural Information Processing Systems)",
        "url": "https://arxiv.org/abs/1706.03762",
        "note": "Introduces the Transformer, the architecture underlying the LLMs that power Cursor's completions and chat."
      },
      {
        "title": "Evaluating Large Language Models Trained on Code",
        "authors": "Mark Chen, Jerry Tworek, Heewoo Jun, Qiming Yuan, et al. (OpenAI)",
        "year": 2021,
        "venue": "arXiv preprint (Codex / HumanEval)",
        "url": "https://arxiv.org/abs/2107.03374",
        "note": "Foundational study of code-generating LLMs and the HumanEval benchmark, the class of models behind AI coding assistants like Cursor."
      }
    ],
    "books": [
      {
        "title": "AI-Assisted Programming: Better Planning, Coding, Testing, and Deployment",
        "authors": "Tom Taulli",
        "year": 2024,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/ai-assisted-programming/9781098164553/",
        "note": "Practical guide to AI coding tools across the SDLC; explicitly covers Cursor alongside Copilot, Tabnine, and general-purpose LLMs."
      }
    ],
    "resources": [
      {
        "label": "Cursor — official homepage",
        "url": "https://cursor.com"
      },
      {
        "label": "Cursor Documentation (Agent, Rules, MCP, CLI)",
        "url": "https://cursor.com/docs"
      }
    ]
  },
  "Claude Code": {
    "category": "Tools & Practice",
    "tagline": "Anthropic's agentic coding tool that lives in your terminal",
    "summary": "Claude Code is Anthropic's agentic command-line coding tool that runs in your terminal, IDE, or CI pipeline and understands an entire codebase through natural-language instructions. It can edit files across a project, run shell commands and tests, handle git workflows, and compose with other Unix tools by piping input and output. It extends through the Model Context Protocol to reach external tools and data sources, and can run scheduled routines on Anthropic-managed infrastructure. It matters because it shifts everyday development from manual, file-by-file editing toward directing an autonomous agent that plans and executes multi-step tasks end to end.",
    "papers": [
      {
        "title": "SWE-bench: Can Language Models Resolve Real-World GitHub Issues?",
        "authors": "Carlos E. Jimenez, John Yang, Alexander Wettig, Shunyu Yao, Kexin Pei, Ofir Press, Karthik Narasimhan",
        "year": 2024,
        "venue": "ICLR 2024",
        "url": "https://arxiv.org/abs/2310.06770",
        "note": "The benchmark that defined the real-world agentic coding task Claude Code is built to perform."
      },
      {
        "title": "Building Effective Agents",
        "authors": "Erik Schluntz, Barry Zhang (Anthropic)",
        "year": 2024,
        "venue": "Anthropic Engineering",
        "url": "https://www.anthropic.com/research/building-effective-agents",
        "note": "Anthropic's own guidance on the agent and workflow patterns underlying tools like Claude Code."
      }
    ],
    "books": [],
    "resources": [
      {
        "label": "Claude Code Documentation (Overview)",
        "url": "https://code.claude.com/docs/en/overview"
      },
      {
        "label": "Claude Code source and issues on GitHub (anthropics/claude-code)",
        "url": "https://github.com/anthropics/claude-code"
      },
      {
        "label": "Model Context Protocol specification",
        "url": "https://modelcontextprotocol.io"
      }
    ]
  },
  "BOB IDE": {
    "category": "Tools & Practice",
    "tagline": "IBM's agentic, AI-first IDE for the full software lifecycle",
    "summary": "BOB IDE (IBM Project Bob) is an agentic, AI-first integrated development environment built as a fork of VS Code that acts as a pair developer across the entire software development lifecycle. It orchestrates multiple large language models (such as Claude, IBM Granite, Mistral, and Llama) and offers distinct Agent, Ask, and Plan modes, plus subagents that run tasks in parallel, to generate, refactor, debug, test, document, and secure code while respecting a codebase's architecture and an organization's standards. IBM targets it especially at enterprise modernization work, including upgrading Java applications and mainframe and IBM i development, and reports adoption by thousands of internal developers. It reached general availability in March 2026 and matters as IBM's enterprise-governed entry into agentic, context-aware AI development tooling.",
    "papers": [],
    "books": [],
    "resources": [
      {
        "label": "IBM Bob — Official Homepage",
        "url": "https://bob.ibm.com/"
      },
      {
        "label": "IBM Bob Documentation",
        "url": "https://bob.ibm.com/docs"
      },
      {
        "label": "Announcing IBM Project Bob (ibm.com)",
        "url": "https://www.ibm.com/new/announcements/ibm-project-bob"
      }
    ]
  },
  "APPLENS": {
    "category": "Tools & Practice",
    "tagline": "Internal app-monitoring & production-support diagnostics tool",
    "summary": "APPLENS (\"application lens\") is a proprietary, internally-deployed application-monitoring and diagnostics tool used in enterprise production-support workflows to observe running applications, surface alerts, and help engineers triage and root-cause incidents. On this engineer's stack it sits beside mainframe tooling such as Endevor, ChangeMan, QMF, and SPUFI, acting as a single operational \"lens\" over application and batch health so problems are caught and diagnosed before they reach users. Because it is a restricted internal/vendor platform rather than a publicly documented product, it has no open academic literature or public manual; the books and resources below cover the underlying application-performance-monitoring and observability discipline it is built on.",
    "papers": [],
    "books": [
      {
        "title": "Site Reliability Engineering: How Google Runs Production Systems",
        "authors": "Betsy Beyer, Chris Jones, Jennifer Petoff, Niall Richard Murphy (eds.)",
        "year": 2016,
        "publisher": "O'Reilly Media",
        "url": "https://sre.google/sre-book/table-of-contents/",
        "note": "Free canonical text on production monitoring, alerting, and incident response — the discipline an app-monitoring tool like APPLENS serves."
      },
      {
        "title": "Observability Engineering: Achieving Production Excellence",
        "authors": "Charity Majors, Liz Fong-Jones, George Miranda",
        "year": 2022,
        "publisher": "O'Reilly Media",
        "url": "https://www.oreilly.com/library/view/observability-engineering/9781492076438/",
        "note": "Modern grounding in how to instrument and diagnose live applications, directly relevant to reading and using a monitoring dashboard."
      }
    ],
    "resources": [
      {
        "label": "AWS — What is Application Performance Monitoring (APM)?",
        "url": "https://aws.amazon.com/what-is/application-performance-monitoring/"
      },
      {
        "label": "OpenTelemetry — official site (the open observability instrumentation standard)",
        "url": "https://opentelemetry.io/"
      },
      {
        "label": "Google SRE Book — \"Monitoring Distributed Systems\" (free chapter)",
        "url": "https://sre.google/sre-book/monitoring-distributed-systems/"
      }
    ]
  },
  "ITIL4": {
    "category": "Tools & Practice",
    "tagline": "Best-practice operating model for modern IT service management",
    "summary": "ITIL 4 is the 2019 update of ITIL (the IT Infrastructure Library), a globally adopted framework of best practices for IT service management (ITSM), maintained by AXELOS and now published by PeopleCert. It centers on a Service Value System with seven guiding principles, four dimensions, and 34 management practices that help organizations co-create value by designing, delivering, and continually improving technology-enabled products and services. Unlike earlier process-heavy versions, ITIL 4 is built to interoperate with Agile, DevOps, and Lean ways of working. It matters because it provides a shared vocabulary and operating model for aligning IT with business value, and underpins one of the most widely held professional certification tracks in the industry.",
    "papers": [
      {
        "title": "ISO/IEC 20000-1:2018 — Information technology — Service management — Part 1: Service management system requirements",
        "authors": "ISO/IEC (International Organization for Standardization / International Electrotechnical Commission)",
        "year": 2018,
        "venue": "ISO/IEC International Standard",
        "url": "https://www.iso.org/standard/70636.html",
        "note": "The formal, auditable ITSM standard closely aligned with ITIL, grounding its service-management concepts in a certifiable requirements framework."
      }
    ],
    "books": [
      {
        "title": "ITIL Foundation, ITIL 4 Edition",
        "authors": "AXELOS",
        "year": 2019,
        "publisher": "TSO (The Stationery Office)",
        "url": "https://books.google.com/books/about/ITIL_Foundation_ITIL_4_Edition.html?id=HmsYwQEACAAJ",
        "note": "The official, definitive ITIL 4 guidance and the basis for the ITIL 4 Foundation exam (ISBN 9780113316076)."
      }
    ],
    "resources": [
      {
        "label": "ITIL 4 Foundation — official AXELOS guidance",
        "url": "https://www.axelos.com/certifications/itil-service-management/itil-4-foundation"
      },
      {
        "label": "PeopleCert — ITIL framework (current owner/publisher)",
        "url": "https://www.peoplecert.org/Frameworks-Professionals/ITIL-framework"
      }
    ]
  },
  "Jupyter": {
    "category": "Tools & Practice",
    "tagline": "Interactive notebooks fusing live code, output, and prose",
    "summary": "Jupyter is an open-source ecosystem for interactive computing built around the notebook: a document that interleaves executable code, its rich output (tables, plots, LaTeX, widgets), and narrative Markdown. Code runs against language-agnostic \"kernels\" — Python (via IPython), R, Julia, and dozens more — through a documented messaging protocol, with JupyterLab and the classic Notebook as the browser-based front ends. It is a staple of data science, scientific research, machine learning experimentation, and teaching because it makes exploratory work iterative and immediately visible. Its notebook format (.ipynb) has also become a widely adopted medium for reproducible, shareable computational workflows.",
    "papers": [
      {
        "title": "Jupyter Notebooks – a publishing format for reproducible computational workflows",
        "authors": "Thomas Kluyver, Benjamin Ragan-Kelley, Fernando Pérez, Brian Granger, et al.",
        "year": 2016,
        "venue": "Positioning and Power in Academic Publishing: Players, Agents and Agendas (ELPUB), IOS Press",
        "url": "https://doi.org/10.3233/978-1-61499-649-1-87",
        "note": "The canonical citation for Project Jupyter, describing the notebook format and its role in reproducible research"
      },
      {
        "title": "IPython: A System for Interactive Scientific Computing",
        "authors": "Fernando Pérez, Brian E. Granger",
        "year": 2007,
        "venue": "Computing in Science & Engineering, IEEE",
        "url": "https://doi.org/10.1109/MCSE.2007.53",
        "note": "The foundational paper on IPython, the interactive interpreter and default kernel that Jupyter grew out of"
      }
    ],
    "books": [
      {
        "title": "Python Data Science Handbook",
        "authors": "Jake VanderPlas",
        "year": 2022,
        "publisher": "O'Reilly Media (2nd ed.)",
        "url": "https://jakevdp.github.io/PythonDataScienceHandbook/",
        "note": "Opens with an in-depth treatment of IPython and the Jupyter notebook; freely readable online"
      },
      {
        "title": "Python for Data Analysis",
        "authors": "Wes McKinney",
        "year": 2022,
        "publisher": "O'Reilly Media (3rd ed.)",
        "url": "https://wesmckinney.com/book/",
        "note": "Uses Jupyter/IPython throughout as the working environment for pandas and NumPy; free canonical web edition"
      }
    ],
    "resources": [
      {
        "label": "Project Jupyter homepage",
        "url": "https://jupyter.org"
      },
      {
        "label": "Official Jupyter documentation",
        "url": "https://docs.jupyter.org"
      },
      {
        "label": "JupyterLab documentation",
        "url": "https://jupyterlab.readthedocs.io"
      }
    ]
  }
};
