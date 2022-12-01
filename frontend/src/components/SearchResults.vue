<template>
  <div v-for="result in searchResults" :key="result.link">
    <h2>
      <a :href="result.Link">{{ result.Title }}</a>
    </h2>
    <p>{{ result.Description_short }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchResults: [
        {
          Title: "Getting Started with Enterprise-grade AI",
          Description_short:
            "This course covers the foundations of Artificial Intelligence for business, including the following topics: AI Evolution, AI Industry Adoption Trends, Natural Language Processing and Virtual Agents.",
          Link: "https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=256c0f15-a1f2-4b9e-b672-63f4d8b20018",
          Topic: "Artificial Intelligence, Capstone",
        },
        {
          Title: "OpenDS4All",
          Description_short:
            "OpenDS4All is a project created to accelerate the creation of data science curriculum at academic institutions. The project hosts educational modules that may be used as building blocks for a data science curriculum.",
          Link: "https://github.com/odpi/OpenDS4All/",
          Topic: "Artificial Intelligence, Data Science",
        },
        {
          Title: "IBM Watson Machine Learning Essentials",
          Description_short:
            "Watson Machine Learning is a service on IBM Cloud with features for training and deploying machine learning models and neural networks. This course consists of a series of videos showing how to use the Watson Machine Learning in Watson Studio.",
          Link: "https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=463ba684-87d1-4355-853a-ec66814584d9",
          Topic: "Artificial Intelligence",
        },
        {
          Title: "IBM AI Education",
          Description_short:
            "We know that students need to understand AI to be successful in the modern workforce. Through this PD experience, teachers will be able to equip their students to think about how AI impacts their lives and what it means for their professional futures.",
          Link: "https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=6d92def9-70bd-4307-9fe8-d2b7372b94f1",
          Topic: "Artificial Intelligence",
        },
        {
          Title: "Data Refinery Essentials",
          Description_short:
            "Data Refinery is a self-service data preparation client for data scientists, data engineers, and business analysts. With it, you can quickly transform large amounts of raw data into consumable, quality information that’s ready for analytics.",
          Link: "https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=84b143de-a18b-40b0-8c5c-46a6e9f511c3",
          Topic: "Artificial Intelligence",
        },
        {
          Title: "IBM Watson Knowledge Catalog Essentials",
          Description_short:
            "IBM Watson Knowledge Catalog is a secure enterprise catalog to index, classify, and govern your data with greater efficiency. Manage your data from every angle giving you a 360-degree view of your data so you can create models, uncover insights, and collaborate more effectively.",
          Link: "https://www.ibm.com/academic/topic/artificial-intelligence?ach_id=4eb246ce-2c42-485e-a50a-47815da40831",
          Topic: "Artificial Intelligence",
        },
        {
          Title: "Getting Started with Enterprise Data Science",
          Description_short:
            "This course provides a basic understanding of the foundations of Data Science including: Data Science Team Roles, Data Analysis Tools, and real-world use cases for the application of the Data Science method.",
          Link: "https://www.ibm.com/academic/topic/capstone?ach_id=8d72f699-26ac-4542-a701-6b69f50e6b5f",
          Topic: "Capstone, Data Science",
        },
        {
          Title: "Getting Started with Threat Intelligence and Hunting",
          Description_short:
            "This is a foundational course, exposing the learner to threat intelligence concepts including: Attack trends by geography, threat intelligence tools and real-world use cases. Complete this course to get your badge.",
          Link: "https://www.ibm.com/academic/topic/capstone?ach_id=3f13c64c-c7ca-45d8-bce1-f05711460f09",
          Topic: "Capstone",
        },
        {
          Title: "Getting Started with Cloud for the Enterprise",
          Description_short:
            "This course covers the basic foundations of cloud for the enterprise including: Consumer applications, Enterprise adoption, Delivery models and Industry Cloud Adoption.",
          Link: "https://www.ibm.com/academic/topic/capstone?ach_id=b9de26db-b689-4894-bcad-5aa28deec936",
          Topic: "Capstone",
        },
        {
          Title: "Constraint Programming with ILOG CP Optimizer",
          Description_short:
            "Fundamentals of constraint programming (CP). CP is demonstrated through the use of ILOG CP Optimizer via ILOG OPL-CPLEX/ILOG Analyst Studio, a complete integrated development environment which leverages the powerful and intuitive algebraic modeling language, Optimization Programming Language.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=520052ab-1ee5-48c5-8f8f-a614a0971bb5",
          Topic: "Data Science",
        },
        {
          Title: "Overview of IBM Cognos Analytics",
          Description_short:
            "This course provides participants with a high level overview of the IBM Cognos Analytics suite of products and their underlying architecture. They will examine each component as it relates to an Analytics solution. Participants will be shown a range of resources to provide additional information.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=fcce46b0-df00-4abc-9b02-cefc3c52ef08",
          Topic: "Data Science",
        },
        {
          Title:
            "IBM Planning Analytics - Design & Develop Models in Workspace",
          Description_short:
            "This course is designed to teach modelers how to build a complete model in IBM Planning Analytics. Through a series of lectures and hands-on exercises, students will learn how to set up dimensions and cubes, manually enter data into these structures, and define the data that users can see.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=94366672-0dd3-4ac6-bf44-9a0d78c43926",
          Topic: "Data Science",
        },
        {
          Title: "IBM Planning Analytics - Analyze Data and Create Reports",
          Description_short:
            "This course is designed to teach analysts how to use IBM Planning Analytics to analyze data to discover trends and exceptions, create and customize reports and templates, and contribute data to plans.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=202b1758-c742-45c3-a8d2-d227bc01c6b8",
          Topic: "Data Science",
        },
        {
          Title: "IBM Cognos Framework Manager - Design Metadata Models",
          Description_short:
            "This course provides an introduction to advanced knowledge of metadata modeling concepts, and how to model metadata for predictable reporting and analysis results using IBM Cognos Framework Manager.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=c6009472-5471-4d40-a3d4-c68fde05ceb4",
          Topic: "Data Science",
        },
        {
          Title: "IBM Cognos Analytics - Author Reports Fundamentals",
          Description_short:
            "This course provides authors with an introduction to build reports using Cognos Analytics. Techniques to enhance, customize, and manage reports will be explored. Activities will illustrate and reinforce key concepts during this learning opportunity.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=72ba50d6-da72-407e-a8f8-1a0c1e3c972f",
          Topic: "Data Science",
        },
        {
          Title: "IBM Cognos Analytics - Author Reports Advanced",
          Description_short:
            "This course teaches experienced authors advanced report building techniques to enhance, customize, manage, and distribute reports. Additionally, the student will learn how to create highly interactive and engaging reports that can be run offline by creating Active Reports.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=31fea6d3-db52-4277-9a4d-0dc964f41c80",
          Topic: "Data Science",
        },
        {
          Title:
            "IBM Cognos Analytics - Author Reports with Multidimensional Data",
          Description_short:
            "Through interactive demonstrations and exercises, participants will learn how to author reports that navigate and manipulate dimensional data structures using the specific dimensional functions and features available in IBM Cognos Analytics.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=0fd39d43-923f-4c81-9d04-3eb642192833",
          Topic: "Data Science",
        },
        {
          Title: "IBM Cognos Analytics - Architecture and Logging",
          Description_short:
            "Through lecture and interactive exercises participants will identify IBM Cognos Analytics components, examine how these components interact with Java, and will explore logging to assist when troubleshooting issues.",
          Link: "https://www.ibm.com/academic/topic/data-science?ach_id=cb5cf932-60fd-4bbd-9951-1bc8c0900e78",
          Topic: "Data Science",
        },
        {
          Title: "IBM Automation Learning Center",
          Description_short:
            "Getting started in your Automation journey is easy! Visit the IBM Automation Learning Center to complete the Future of Work learning modules and visit Credly to see the requirements for the IBM Automation Compass badge. Once you are ready to dive in, the completion of lessons you will allow you to earn an externally recognized badge to showcase your understanding of Automation in business.",
          Link: "https://www.ibm.com/academic/topic/ibm-automation?ach_id=cd823e98-d665-4f0a-885f-34273091e71e",
          Topic: "IBM Automation",
        },
        {
          Title: "IBM Process Mining Collection",
          Description_short:
            "Process mining uses business system data to create and visualize an end-to-end process that includes all the process activities involved along with the various process paths. Businesses analyze the discovered process to gain actionable insights for improvement.",
          Link: "https://www.ibm.com/academic/topic/ibm-automation?ach_id=3e44a76c-f261-4849-8f75-8c89802be296",
          Topic: "IBM Automation",
        },
        {
          Title: "IBM Robotic Process Automation - Basic I",
          Description_short:
            "This is an introductory course to IBM Robotic Process Automation. In this course, students will learn the basics of inserting commands, publishing scripts, controlling the flow of scripts, and many other RPA essentials. This course provides students with the opportunity to learn and sharpen the basic skills needed to successfully learn IBM’s Robotic Process Automation.",
          Link: "https://www.ibm.com/academic/topic/ibm-automation?ach_id=eadb3ad7-335b-4152-b7b9-28ac8439844d",
          Topic: "IBM Automation",
        },
        {
          Title: "IBM Robotic Process Automation - Basic II",
          Description_short:
            "RPA Basic II is a continuation of the Basic I course, where students will further their RPA skills and learn more in-depth and essential concepts for the development of the programmer within IBM RPA resources. This course covers the use of assets, parameters, and the manipulation of PDFs, data tables, and databases",
          Link: "https://www.ibm.com/academic/topic/ibm-automation?ach_id=ca833692-6a84-4db4-828e-44f38b7e432a",
          Topic: "IBM Automation",
        },
        {
          Title: "Overview of Process Mining",
          Description_short:
            "This course introduces students to IBM Process Mining. Students will learn the differences between process mining and task mining, the different phases of process mining, use cases, and how process mining is performed. Students will also learn how to use IBM Process Mining to import data sources, map data, and how to visualize a process, along with the introduction to other major features of process mining.",
          Link: "https://www.ibm.com/academic/topic/ibm-automation?ach_id=d4536c1f-3c0c-4350-b675-0b7f29820ae0",
          Topic: "IBM Automation",
        },
        {
          Title: "Fundamentals of IBM Process Mining",
          Description_short:
            "Fundamentals of IBM process mining is a collection of courses that introduces students to process mining and how it is used to perform process and data analysis. Students will learn how to evaluate a process for potential candidates for Robotic Process Automation implementation. Students will also learn advanced data preparation, transformation concepts, and how to evaluate a multi-level process for maverick buying patterns. Finally, students will learn how to create and visualize end-to-end processes that include all process activities involved along with various process paths.",
          Link: "https://www.ibm.com/academic/topic/ibm-automation?ach_id=fe69d706-50d9-4c99-86e7-b79a91c4eefe",
          Topic: "IBM Automation",
        },
        {
          Title: "Journey to Cloud: Envisioning Your Solution",
          Description_short:
            "This credential earner demonstrates knowledge and understanding of the digital transformation drivers made possible by cloud technologies and services. This includes: how cloud works, its capabilities, types, and delivery models (IaaS, SaaS, and PaaS); digital transformation strategies such as Agile practices, the IBM Garage Method, and Enterprise Design Thinking to help organizations get started on their transformation journey; & deploying a test pilot cloud application using IBM Code Engine.",
          Link: "https://www.ibm.com/academic/topic/cloud?ach_id=c0b2b320-7cac-4b42-b5d9-10bbf2c6890e",
          Topic: "IBM Cloud",
        },
        {
          Title: "Solution tutorials",
          Description_short:
            "Learn how to build, deploy and scale real-world solutions on IBM Cloud. These guides provide step-by-step instructions on how to use IBM Cloud to implement common patterns based on best practices and proven technologies.",
          Link: "https://www.ibm.com/academic/topic/cloud?ach_id=e79ecf63-74ae-4e12-b0b2-e97de8693f36",
          Topic: "IBM Cloud",
        },
        {
          Title: "IBM Cloud Associate Solution Advisor",
          Description_short:
            "Learners in any job role can get a first look at cloud computing and IBM Cloud. No experience needed. Learn to discuss and use cloud services with confidence. Earn your first cloud certification.",
          Link: "https://www.ibm.com/academic/topic/cloud?ach_id=a8c57c17-476e-4b1d-8ee9-cebbbcf7029a",
          Topic: "IBM Cloud",
        },
        {
          Title: "Cloud Native Bootcamp",
          Description_short:
            "Cloud is everywhere. Today, many companies want to migrate their applications on to cloud. For this migration to be done, the applications must be re-architected in a way that they fully utilize the advantages of the cloud.",
          Link: "https://www.ibm.com/academic/topic/cloud?ach_id=0a0ed707-058c-4bc0-b0bf-d3719d21153d",
          Topic: "IBM Cloud",
        },
        {
          Title: "IBM CloudLabs",
          Description_short:
            "With IBM CloudLabs, you'll have a chance to learn how to operate Kubernetes on IBM Cloud by completing three free interactive labs, entirely through your web browser.",
          Link: "https://www.ibm.com/academic/topic/cloud?ach_id=9aa7bbb1-08c9-4e8f-83e5-365cfb3722ea",
          Topic: "IBM Cloud",
        },
        {
          Title: "Quick Start Sessions",
          Description_short:
            "Learn how to use IBM Engineering tools. Quick Starts are short, focused, introductory hands-on labs designed to take less than two hours to complete.",
          Link: "https://www.ibm.com/academic/topic/engineering?ach_id=4212934e-7c84-4947-9e5a-4110dd206ddc",
          Topic: "IBM Engineering",
        },
        {
          Title: "IBM Security Learning Academy",
          Description_short:
            "Get free technical training for IBM Security products. You can explore the course catalog and build your own curriculum by enrolling in courses.",
          Link: "https://www.ibm.com/academic/topic/security?ach_id=ae814370-9289-408a-b08d-26a97a9d459d",
          Topic: "IBM Security",
        },
        {
          Title: "Getting Started with Threat Intelligence and Hunting",
          Description_short:
            "This is a foundational course, exposing the learner to threat intelligence concepts including: Attack trends by geography, threat intelligence tools and real-world use cases. Complete this course to get your badge.",
          Link: "https://www.ibm.com/academic/topic/security?ach_id=3f13c64c-c7ca-45d8-bce1-f05711460f09",
          Topic: "IBM Security",
        },
        {
          Title: "IBM QRadar SIEM Foundations",
          Description_short:
            "IBM QRadar SIEM provides deep visibility into network, user, and application activity. It provides collection, normalization, correlation, and secure storage of events, flows, asset profiles, and vulnerabilities. QRadar SIEM classifies suspected attacks and policy violations as offenses.",
          Link: "https://www.ibm.com/academic/topic/security?ach_id=391e3430-e89c-4aba-a067-605eb5f9f9a6",
          Topic: "IBM Security",
        },
        {
          Title: "IBM QRadar SIEM Advanced Topics",
          Description_short:
            "Using the skills taught in this course, you will be able to configure processing of uncommon events, work with reference data, and develop custom rules, custom actions, and custom anomoly detection rules using IBM Security QRadar.",
          Link: "https://www.ibm.com/academic/topic/security?ach_id=efe68f7c-4ecc-4af3-986a-fd20767a254c",
          Topic: "IBM Security",
        },
        {
          Title: "Developing Secure Software",
          Description_short:
            "Learn the security basics to develop software that is hardened against attacks, and understand how you can reduce the damage and speed the response when a vulnerability is exploited. Thanks to the involvement of OpenSSF, a cross-industry collaboration that brings together leaders to improve the security of open source software by building a broader community, targeted initiatives, and best practices, this course provides specific tips on how to use and develop open source and other software securely.",
          Link: "https://www.ibm.com/academic/topic/security?ach_id=5fa327da-d138-4893-989f-7f46e625ecab",
          Topic: "IBM Security",
        },
        {
          Title: "IBM Z Enterprise Computing Kickstart",
          Description_short:
            "13 Courses (56 hours) of online, self-paced courses covering topics from the z/OS Mainframe System, the IBM Development Environment, JCL, WebSphere, COBOL and DB2. Differentiate yourself with essential skills needed by Fortune 500 companies to run their mission-critical workloads.",
          Link: "https://www.ibm.com/academic/topic/ibm-z?ach_id=8686319f-40c7-480d-9246-87f33c3dde32",
          Topic: "IBM Z",
        },
        {
          Title: "z/OS Introduction",
          Description_short:
            "This series of short videos teaches you about the IBM Z environment. The course starts from the beginning teaching IBM Z basics and the flagship operating system z/OS. The course addresses access and interaction basics, data sets and data access methods, and operating system environment topics.",
          Link: "https://www.ibm.com/academic/topic/ibm-z?ach_id=f31ea33c-da0b-426c-97d2-1dd5cebaa0ed",
          Topic: "IBM Z",
        },
        {
          Title: "Red Hat System Administration I (RH124)",
          Description_short:
            "The first of two courses that cover the core system administration tasks needed to manage Red Hat® Enterprise Linux® servers.",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=8f7e3d8b-2faa-4d96-8297-7607bc22c909",
          Topic: "Red Hat Academy",
        },
        {
          Title: "Red Hat System Administration II (RH134)",
          Description_short:
            "Red Hat System Administration II (RH134) serves as the second part of the RHCSA training track for IT professionals who have taken Red Hat System Administration I (RH124). The course goes deeper into core Linux system administration skills in storage configuration and management, installation and deployment of Red Hat® Enterprise Linux®, management of security features such as SELinux, control of recurring system tasks, management of the boot process and troubleshooting, basic system tuning, and command-line automation and productivity. Experienced Linux administrators looking for rapid preparation for the RHCSA certification should instead start with RHCSA Rapid Track (RH199). This course is based on Red Hat Enterprise Linux 9.0.",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=a228722e-455c-4ed9-84ea-55d946831efe",
          Topic: "Red Hat Academy",
        },
        {
          Title: "Red Hat Enterprise Linux Automation with Ansible (RH294)",
          Description_short:
            "Learn how to automate Linux system administration tasks with Red Hat Ansible® Automation Platform",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=38365183-48ac-44a4-acba-c13e1a06d0d5",
          Topic: "Red Hat Academy",
        },
        {
          Title: "Introduction to OpenShift Applications (DO101)",
          Description_short:
            "A developer-focused introduction to OpenShift application building, deployment, scaling, and troubleshooting.",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=60f1582a-7652-4f98-bede-11abff141977",
          Topic: "Red Hat Academy",
        },
        {
          Title: "Red Hat OpenShift I: Containers & Kubernetes (DO180)",
          Description_short:
            "Introduction to building and managing containers for deployment on a Kubernetes and OpenShift 4 cluster.",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=ff8c2e5d-182b-4c2f-9c97-61f714e85ea0",
          Topic: "Red Hat Academy",
        },
        {
          Title:
            "Red Hat OpenStack Administration I: Core Operations for Domain Operators (CL110)",
          Description_short:
            "Learn to operate a Red Hat OpenStack Platform private cloud and manage domain resources to secure and deploy modern, scalable cloud applications, networks, and storage.",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=40ac4ef9-0288-4c24-8c89-6bd07e74cae4",
          Topic: "Red Hat Academy",
        },
        {
          Title:
            "Red Hat Application Development I: Programming in Java EE (AD183)",
          Description_short:
            "Red Hat Application Development I: Programming in Java EE (AD183) exposes experienced Java Standard Edition (Java SE) developers to the world of Java Enterprise Edition (Java EE). This course is based on Red Hat® Enterprise Application Platform 7.0. In this course, you will learn about the various specifications that make up Java EE. Through hands-on labs, you will transform a simple Java SE command line application into a multi-tiered enterprise application using various Java EE specifications, including Enterprise Java Beans, Java Persistence API, Java Messaging Service, JAX-RS for REST services, Contexts and Dependency Injection (CDI), and JAAS for securing the application.",
          Link: "https://www.ibm.com/academic/topic/red-hat?ach_id=9020b442-a0af-475d-9582-717332aee248",
          Topic: "Red Hat Academy",
        },
        {
          Title: "Qiskit Textbook",
          Description_short:
            "Qiskit makes it easy to start learning quantum software to run on real quantum hardware. Teach your students with the same tools used by scientists and engineers worldwide to accelerate research towards practical applications for quantum computing",
          Link: "https://www.ibm.com/academic/topic/quantum-computing?ach_id=1b63f368-d46f-48d3-8221-75b7f9ec515d",
          Topic: "IBM Quantum",
        },
        {
          Title: "Introduction to Quantum Computing and Quantum Hardware",
          Description_short:
            "This course is an introduction to the world of quantum computing, with an exploration of some of the key quantum algorithms and their implementations using quantum circuits, as well as the quantum hardware that is designed to run these algorithms.",
          Link: "https://www.ibm.com/academic/topic/quantum-computing?ach_id=c6ab97cf-7d60-4437-b3e5-a29ee75f72dc",
          Topic: "IBM Quantum",
        },
        {
          Title: "Quantum Machine Learning",
          Description_short:
            "This course contains around eight hours of content, and is aimed at self-learners who are comfortable with undergraduate-level mathematics and quantum computing fundamentals. This course will take you through key concepts in quantum machine learning, such as parameterized quantum circuits, training these circuits, and applying them to basic problems. By the end of the course, you’ll understand the state of the field, and you’ll be familiar with recent developments in both supervised and unsupervised learning such as quantum kernels and general adversarial networks. This course finishes with a project that you can use to showcase what you’ve learnt.",
          Link: "https://www.ibm.com/academic/topic/quantum-computing?ach_id=4980ab77-f539-48de-926f-39ed73caa049",
          Topic: "IBM Quantum",
        },
      ],
    };
  },
};
</script>
